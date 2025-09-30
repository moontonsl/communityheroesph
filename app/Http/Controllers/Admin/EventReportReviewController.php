<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EventReporting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class EventReportReviewController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $userRole = $user->role->slug ?? '';

        // Only Super Admin users can access this
        if (!in_array($userRole, ['super-admin', 'super-admin-a', 'super-admin-b'])) {
            abort(403, 'Access denied. Only Super Admin users can access this page.');
        }

        // Get all reports for Super Admin users
        $reportsQuery = EventReporting::with(['event', 'reportedBy', 'reviewedBy', 'approvedBy', 'firstClearedBy', 'finalClearedBy']);

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

        return Inertia::render('admin/event-report-review', [
            'reports' => $reports,
            'stats' => $stats,
            'user' => $user
        ]);
    }

    public function show($id)
    {
        $user = Auth::user();
        $userRole = $user->role->slug ?? '';

        // Only Super Admin users can access this
        if (!in_array($userRole, ['super-admin', 'super-admin-a', 'super-admin-b'])) {
            abort(403, 'Access denied. Only Super Admin users can access this page.');
        }

        $report = EventReporting::with(['event', 'reportedBy', 'reviewedBy', 'approvedBy', 'firstClearedBy', 'finalClearedBy'])
            ->findOrFail($id);

        return Inertia::render('admin/event-report-review-show', [
            'report' => $report,
            'user' => $user
        ]);
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

        // Only Super Admin and Super Admin A can approve reports
        if (!in_array($userRole, ['super-admin', 'super-admin-a'])) {
            return redirect()->back()->withErrors(['error' => 'Access denied. Only Super Admin and Super Admin A can approve reports.']);
        }

        $report = EventReporting::findOrFail($id);

        if (!$report->isReviewed()) {
            return redirect()->back()->withErrors(['error' => 'Only reviewed reports can be approved']);
        }

        $request->validate([
            'admin_notes' => 'nullable|string|max:1000'
        ]);

        try {
            $report->approve($user, $request->admin_notes);

            return redirect()->route('event-report-review.show', $report->id)
                            ->with('success', 'Event report approved successfully');

        } catch (\Exception $e) {
            \Log::error('Event report approval failed', [
                'report_id' => $id,
                'error' => $e->getMessage()
            ]);

            return redirect()->back()->withErrors(['error' => 'Failed to approve event report. Please try again.']);
        }
    }

    public function firstClearance($id)
    {
        $user = Auth::user();
        $userRole = $user->role->slug ?? '';

        // Only Super Admin and Super Admin A can do first clearance
        if (!in_array($userRole, ['super-admin', 'super-admin-a'])) {
            return redirect()->back()->withErrors(['error' => 'Access denied. Only Super Admin and Super Admin A can perform first clearance.']);
        }

        $report = EventReporting::findOrFail($id);

        if (!$report->isApproved()) {
            return redirect()->back()->withErrors(['error' => 'Only approved reports can be cleared']);
        }

        try {
            $report->firstClear($user);

            return redirect()->route('event-report-review.show', $report->id)
                            ->with('success', 'First clearance completed successfully');

        } catch (\Exception $e) {
            \Log::error('First clearance failed', [
                'report_id' => $id,
                'error' => $e->getMessage()
            ]);

            return redirect()->back()->withErrors(['error' => 'Failed to complete first clearance. Please try again.']);
        }
    }

    public function finalClearance($id)
    {
        $user = Auth::user();
        $userRole = $user->role->slug ?? '';

        // Only Super Admin B can do final clearance
        if ($userRole !== 'super-admin-b') {
            return redirect()->back()->withErrors(['error' => 'Access denied. Only Super Admin B can perform final clearance.']);
        }

        $report = EventReporting::findOrFail($id);

        if (!$report->isFirstCleared()) {
            return redirect()->back()->withErrors(['error' => 'First clearance must be completed before final clearance']);
        }

        try {
            $report->finalClear($user);

            return redirect()->route('event-report-review.show', $report->id)
                            ->with('success', 'Final clearance completed successfully');

        } catch (\Exception $e) {
            \Log::error('Final clearance failed', [
                'report_id' => $id,
                'error' => $e->getMessage()
            ]);

            return redirect()->back()->withErrors(['error' => 'Failed to complete final clearance. Please try again.']);
        }
    }

    public function updateFinancials(Request $request, $id)
    {
        $user = Auth::user();
        $userRole = $user->role->slug ?? '';

        // Only Super Admin and Super Admin A can update financials
        if (!in_array($userRole, ['super-admin', 'super-admin-a'])) {
            return redirect()->back()->withErrors(['error' => 'Access denied. Only Super Admin and Super Admin A can update financial information.']);
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

            return redirect()->route('event-report-review.show', $report->id)
                            ->with('success', 'Financial information updated successfully');

        } catch (\Exception $e) {
            \Log::error('Financial update failed', [
                'report_id' => $id,
                'error' => $e->getMessage()
            ]);

            return redirect()->back()->withErrors(['error' => 'Failed to update financial information. Please try again.']);
        }
    }
}