<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EventReporting;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EventReportingController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $userRole = $user->role->slug ?? '';

        // Only Area Admin and Community Lead can access Event Reporting
        if (!in_array($userRole, ['area-admin', 'community-lead'])) {
            abort(403, 'Access denied. Only Area Admin and Community Lead can access Event Reporting.');
        }

        // Get events that are approved/completed/cleared and can have reports
        $eventsQuery = Event::with([
            'barangaySubmission',
            'barangaySubmission.region',
            'barangaySubmission.province',
            'barangaySubmission.municipality',
            'barangaySubmission.barangay',
            'appliedBy',
            'assignedUser'
        ])->whereIn('status', ['APPROVED', 'COMPLETED', 'CLEARED']);

        // Filter events based on user role
        if ($userRole === 'area-admin') {
            $eventsQuery->where('assigned_user_id', $user->id);
        } elseif ($userRole === 'community-lead') {
            $eventsQuery->where('applied_by', $user->id);
        }
        // Super Admin users (super-admin, super-admin-a, super-admin-b) can see all events

        // Exclude events that already have reports by this user
        $eventsWithReports = EventReporting::where('reported_by', $user->id)->pluck('event_id');
        $eventsQuery->whereNotIn('id', $eventsWithReports);

        $events = $eventsQuery->orderBy('event_date', 'desc')->get();

        // Get existing reports
        $reportsQuery = EventReporting::with(['event', 'reportedBy', 'reviewedBy', 'approvedBy', 'firstClearedBy', 'finalClearedBy']);

        // Filter reports based on user role
        if ($userRole === 'area-admin') {
            $reportsQuery->where('reported_by', $user->id);
        } elseif ($userRole === 'community-lead') {
            $reportsQuery->where('reported_by', $user->id);
        }
        // Super Admin users (super-admin, super-admin-a, super-admin-b) can see all reports

        $reports = $reportsQuery->orderBy('created_at', 'desc')->get();

        // Get statistics
        $stats = [
            'total_reports' => $reportsQuery->count(),
            'draft_reports' => $reportsQuery->clone()->draft()->count(),
            'submitted_reports' => $reportsQuery->clone()->submitted()->count(),
            'pre_approved_reports' => $reportsQuery->clone()->preApproved()->count(),
            'reviewed_reports' => $reportsQuery->clone()->reviewed()->count(),
            'approved_reports' => $reportsQuery->clone()->approved()->count(),
        ];

        return Inertia::render('admin/event-reporting', [
            'events' => $events,
            'reports' => $reports,
            'stats' => $stats,
            'user' => $user
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        $userRole = $user->role->slug ?? '';

        // Get events that are approved/completed/cleared and can have reports
        $eventsQuery = Event::with([
            'barangaySubmission',
            'barangaySubmission.region',
            'barangaySubmission.province',
            'barangaySubmission.municipality',
            'barangaySubmission.barangay',
            'appliedBy',
            'assignedUser'
        ])->whereIn('status', ['APPROVED', 'COMPLETED', 'CLEARED']);

        // Filter events based on user role
        if ($userRole === 'area-admin') {
            $eventsQuery->where('assigned_user_id', $user->id);
        } elseif ($userRole === 'community-lead') {
            $eventsQuery->where('applied_by', $user->id);
        }
        // Super Admin users (super-admin, super-admin-a, super-admin-b) can see all events

        // Exclude events that already have reports by this user
        $eventsWithReports = EventReporting::where('reported_by', $user->id)->pluck('event_id');
        $eventsQuery->whereNotIn('id', $eventsWithReports);

        $events = $eventsQuery->orderBy('event_date', 'desc')->get();

        return Inertia::render('admin/event-reporting-create', [
            'events' => $events,
            'user' => $user
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $userRole = $user->role->slug ?? '';

        // Validate that user has permission to create reports
        if (!in_array($userRole, ['area-admin', 'community-lead'])) {
            return redirect()->back()->withErrors(['error' => 'Access denied. Only Area Admin and Community Lead can create event reports.']);
        }

        $request->validate([
            'event_id' => 'required|exists:events,id',
            'post_event_file' => 'nullable|file|mimes:pdf|max:10240' // 10MB max
        ]);

        try {
            // Get the event
            $event = Event::findOrFail($request->event_id);

            // Verify user has permission to report on this event
            if ($userRole === 'area-admin' && $event->assigned_user_id !== $user->id) {
                return redirect()->back()->withErrors(['error' => 'Access denied. You can only report on events assigned to you.']);
            } elseif ($userRole === 'community-lead' && $event->applied_by !== $user->id) {
                return redirect()->back()->withErrors(['error' => 'Access denied. You can only report on events you applied for.']);
            }

            // Check if report already exists for this event
            $existingReport = EventReporting::where('event_id', $request->event_id)
                ->where('reported_by', $user->id)
                ->first();

            if ($existingReport) {
                return redirect()->back()->withErrors(['error' => 'A report already exists for this event.']);
            }

            // Handle file upload
            $filePath = null;
            $fileName = null;
            if ($request->hasFile('post_event_file')) {
                $file = $request->file('post_event_file');
                $fileName = 'post_event_' . time() . '_' . uniqid() . '.pdf';
                $filePath = $file->storeAs('post_event_files', $fileName, 'public');
            }

            // Create the report
            $report = EventReporting::create([
                'event_id' => $request->event_id,
                'reported_by' => $user->id,
                'event_name' => $event->event_name,
                'event_description' => $event->event_description,
                'event_date' => $event->event_date,
                'event_location' => $event->event_location,
                'campaign' => $event->campaign,
                'post_event_file_path' => $filePath,
                'post_event_file_name' => $fileName,
                'status' => 'DRAFT'
            ]);

            return redirect()->route('event-reporting.show', $report->id)
                            ->with('success', 'Event report created successfully');

        } catch (\Exception $e) {
            \Log::error('Event report creation failed', [
                'user_id' => $user->id,
                'event_id' => $request->event_id,
                'error' => $e->getMessage()
            ]);

            return redirect()->back()->withErrors(['error' => 'Failed to create event report. Please try again.']);
        }
    }

    public function show($id)
    {
        $user = Auth::user();
        $report = EventReporting::with(['event', 'reportedBy', 'reviewedBy', 'approvedBy', 'firstClearedBy', 'finalClearedBy'])
            ->findOrFail($id);

        // Check permissions
        $userRole = $user->role->slug ?? '';
        if ($userRole === 'area-admin' && $report->reported_by !== $user->id) {
            abort(403, 'Access denied');
        } elseif ($userRole === 'community-lead' && $report->reported_by !== $user->id) {
            abort(403, 'Access denied');
        }

        return Inertia::render('admin/event-reporting-show', [
            'report' => $report,
            'user' => $user
        ]);
    }

    public function edit($id)
    {
        $user = Auth::user();
        $report = EventReporting::with(['event'])
            ->findOrFail($id);

        // Check permissions - only draft reports can be edited
        $userRole = $user->role->slug ?? '';
        if ($report->reported_by !== $user->id) {
            abort(403, 'Access denied');
        }

        if (!$report->isDraft()) {
            abort(403, 'Only draft reports can be edited');
        }

        return Inertia::render('admin/event-reporting-edit', [
            'report' => $report,
            'user' => $user
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $report = EventReporting::findOrFail($id);

        // Check permissions
        $userRole = $user->role->slug ?? '';
        if ($report->reported_by !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied'
            ], 403);
        }

        if (!$report->isDraft()) {
            return response()->json([
                'success' => false,
                'message' => 'Only draft reports can be edited'
            ], 400);
        }

        $request->validate([
            'post_event_file' => 'nullable|file|mimes:pdf|max:10240'
        ]);

        try {
            $updateData = [];

            // Handle file upload
            if ($request->hasFile('post_event_file')) {
                // Delete old file if exists
                if ($report->post_event_file_path) {
                    Storage::disk('public')->delete($report->post_event_file_path);
                }

                $file = $request->file('post_event_file');
                $fileName = 'post_event_' . time() . '_' . uniqid() . '.pdf';
                $filePath = $file->storeAs('post_event_files', $fileName, 'public');
                
                $updateData['post_event_file_path'] = $filePath;
                $updateData['post_event_file_name'] = $fileName;
            }

            $report->update($updateData);

            return redirect()->route('event-reporting.show', $report->id)
                            ->with('success', 'Event report updated successfully');

        } catch (\Exception $e) {
            \Log::error('Event report update failed', [
                'report_id' => $id,
                'error' => $e->getMessage()
            ]);

            return redirect()->back()->withErrors(['error' => 'Failed to update event report. Please try again.']);
        }
    }

    public function submit($id)
    {
        $user = Auth::user();
        $report = EventReporting::findOrFail($id);

        // Check permissions
        if ($report->reported_by !== $user->id) {
            return redirect()->back()->withErrors(['error' => 'Access denied']);
        }

        if (!$report->isDraft()) {
            return redirect()->back()->withErrors(['error' => 'Only draft reports can be submitted']);
        }

        try {
            $report->submit();

            return redirect()->route('event-reporting.show', $report->id)
                            ->with('success', 'Event report submitted successfully');

        } catch (\Exception $e) {
            \Log::error('Event report submission failed', [
                'report_id' => $id,
                'error' => $e->getMessage()
            ]);

            return redirect()->back()->withErrors(['error' => 'Failed to submit event report. Please try again.']);
        }
    }

    public function preApprove(Request $request, $id)
    {
        $user = Auth::user();
        $userRole = $user->role->slug ?? '';

        // Only Community Lead can pre-approve reports
        if ($userRole !== 'community-lead') {
            return redirect()->back()->withErrors(['error' => 'Access denied. Only Community Lead can pre-approve reports.']);
        }

        $report = EventReporting::findOrFail($id);

        if (!$report->isSubmitted()) {
            return redirect()->back()->withErrors(['error' => 'Only submitted reports can be pre-approved']);
        }

        $request->validate([
            'admin_notes' => 'nullable|string|max:1000'
        ]);

        try {
            $report->preApprove($user, $request->admin_notes);

            return redirect()->route('event-reporting.show', $report->id)
                            ->with('success', 'Event report pre-approved successfully');

        } catch (\Exception $e) {
            \Log::error('Event report pre-approval failed', [
                'report_id' => $id,
                'error' => $e->getMessage()
            ]);

            return redirect()->back()->withErrors(['error' => 'Failed to pre-approve event report. Please try again.']);
        }
    }

    public function review(Request $request, $id)
    {
        $user = Auth::user();
        $userRole = $user->role->slug ?? '';

        // Only Super Admin and Super Admin A can review reports
        if (!in_array($userRole, ['super-admin', 'super-admin-a'])) {
            return redirect()->back()->withErrors(['error' => 'Access denied. Only Super Admin and Super Admin A can review reports.']);
        }

        $report = EventReporting::findOrFail($id);

        if (!$report->isPreApproved()) {
            return redirect()->back()->withErrors(['error' => 'Only pre-approved reports can be reviewed']);
        }

        $request->validate([
            'admin_notes' => 'nullable|string|max:1000'
        ]);

        try {
            $report->review($user, $request->admin_notes);

            return redirect()->route('event-report-review.show', $report->id)
                            ->with('success', 'Event report reviewed successfully');

        } catch (\Exception $e) {
            \Log::error('Event report review failed', [
                'report_id' => $id,
                'error' => $e->getMessage()
            ]);

            return redirect()->back()->withErrors(['error' => 'Failed to review event report. Please try again.']);
        }
    }

    public function approve(Request $request, $id)
    {
        $user = Auth::user();
        $userRole = $user->role->slug ?? '';

        // Only Super Admin A can approve reports
        if (!in_array($userRole, ['super-admin-a', 'super-admin'])) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Only Super Admin can approve reports.'
            ], 403);
        }

        $report = EventReporting::findOrFail($id);

        if (!$report->isReviewed()) {
            return response()->json([
                'success' => false,
                'message' => 'Only reviewed reports can be approved'
            ], 400);
        }

        $request->validate([
            'admin_notes' => 'nullable|string|max:1000'
        ]);

        try {
            $report->approve($user, $request->admin_notes);

            return response()->json([
                'success' => true,
                'message' => 'Event report approved successfully',
                'report' => $report->fresh(['event', 'reportedBy', 'reviewedBy', 'approvedBy'])
            ]);

        } catch (\Exception $e) {
            \Log::error('Event report approval failed', [
                'report_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to approve event report. Please try again.'
            ], 500);
        }
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $report = EventReporting::findOrFail($id);

        // Check permissions
        if ($report->reported_by !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied'
            ], 403);
        }

        if (!$report->isDraft()) {
            return response()->json([
                'success' => false,
                'message' => 'Only draft reports can be deleted'
            ], 400);
        }

        try {
            // Delete file if exists
            if ($report->post_event_file_path) {
                Storage::disk('public')->delete($report->post_event_file_path);
            }

            $report->delete();

            return response()->json([
                'success' => true,
                'message' => 'Event report deleted successfully'
            ]);

        } catch (\Exception $e) {
            \Log::error('Event report deletion failed', [
                'report_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete event report. Please try again.'
            ], 500);
        }
    }

    public function updateFinancials(Request $request, $id)
    {
        $user = Auth::user();
        $userRole = $user->role->slug ?? '';

        // Only Super Admin A and Super Admin can update financials
        if (!in_array($userRole, ['super-admin-a', 'super-admin'])) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Only Super Admin can update Post Event Information.'
            ], 403);
        }

        $report = EventReporting::findOrFail($id);

        $request->validate([
            'pic' => 'nullable|string|max:255',
            'cash_allocation' => 'nullable|numeric|min:0',
            'diamonds_expenditure' => 'nullable|integer|min:0',
            'total_cost_php' => 'nullable|numeric|min:0'
        ]);

        try {
            $report->update([
                'pic' => $request->pic,
                'cash_allocation' => $request->cash_allocation,
                'diamonds_expenditure' => $request->diamonds_expenditure,
                'total_cost_php' => $request->total_cost_php
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Post Event Information updated successfully',
                'report' => $report->fresh(['event', 'reportedBy'])
            ]);

        } catch (\Exception $e) {
            \Log::error('Financial update failed', [
                'report_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update Post Event Information. Please try again.'
            ], 500);
        }
    }

    public function firstClearance($id)
    {
        $user = Auth::user();
        $userRole = $user->role->slug ?? '';

        // Only Super Admin A and Super Admin can do first clearance
        if (!in_array($userRole, ['super-admin-a', 'super-admin'])) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Only Super Admin can perform first clearance.'
            ], 403);
        }

        $report = EventReporting::findOrFail($id);

        if (!$report->isApproved()) {
            return response()->json([
                'success' => false,
                'message' => 'Only approved reports can be cleared'
            ], 400);
        }

        try {
            $report->firstClear($user);

            return response()->json([
                'success' => true,
                'message' => 'First clearance completed successfully',
                'report' => $report->fresh(['event', 'reportedBy', 'firstClearedBy'])
            ]);

        } catch (\Exception $e) {
            \Log::error('First clearance failed', [
                'report_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to complete first clearance. Please try again.'
            ], 500);
        }
    }

    public function finalClearance($id)
    {
        $user = Auth::user();
        $userRole = $user->role->slug ?? '';

        // Only Super Admin B can do final clearance
        if ($userRole !== 'super-admin-b') {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Only Super Admin B can perform final clearance.'
            ], 403);
        }

        $report = EventReporting::findOrFail($id);

        if (!$report->isFirstCleared()) {
            return response()->json([
                'success' => false,
                'message' => 'First clearance must be completed before final clearance'
            ], 400);
        }

        try {
            $report->finalClear($user);

            return response()->json([
                'success' => true,
                'message' => 'Final clearance completed successfully',
                'report' => $report->fresh(['event', 'reportedBy', 'firstClearedBy', 'finalClearedBy'])
            ]);

        } catch (\Exception $e) {
            \Log::error('Final clearance failed', [
                'report_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to complete final clearance. Please try again.'
            ], 500);
        }
    }
}
