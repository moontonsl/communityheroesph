<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BarangaySubmission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubmissionController extends Controller
{
    public function index()
    {
        $submissions = BarangaySubmission::with(['region', 'province', 'municipality', 'barangay', 'approvedBy', 'reviewedBy'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);
        
        $stats = [
            'total' => BarangaySubmission::count(),
            'pending' => BarangaySubmission::pending()->count(),
            'approved' => BarangaySubmission::approved()->count(),
            'rejected' => BarangaySubmission::rejected()->count(),
            'under_review' => BarangaySubmission::underReview()->count(),
        ];
        
        return Inertia::render('admin/submissions', [
            'submissions' => $submissions,
            'stats' => $stats
        ]);
    }
    
    public function show($id)
    {
        $submission = BarangaySubmission::with(['region', 'province', 'municipality', 'barangay', 'approvedBy', 'reviewedBy'])
            ->findOrFail($id);
        
        return Inertia::render('admin/submission-details', [
            'submission' => $submission
        ]);
    }
    
    public function approve(Request $request, $id)
    {
        $submission = BarangaySubmission::findOrFail($id);
        
        $request->validate([
            'admin_notes' => 'nullable|string|max:1000'
        ]);
        
        $submission->approve(auth()->user(), $request->admin_notes);
        
        return redirect()->back()->with('success', 'Submission approved successfully');
    }
    
    public function reject(Request $request, $id)
    {
        $submission = BarangaySubmission::findOrFail($id);
        
        $request->validate([
            'rejection_reason' => 'required|string|max:1000',
            'admin_notes' => 'nullable|string|max:1000'
        ]);
        
        $submission->reject(auth()->user(), $request->rejection_reason, $request->admin_notes);
        
        return redirect()->back()->with('success', 'Submission rejected successfully');
    }
    
    public function markUnderReview(Request $request, $id)
    {
        $submission = BarangaySubmission::findOrFail($id);
        
        $request->validate([
            'admin_notes' => 'nullable|string|max:1000'
        ]);
        
        $submission->markUnderReview(auth()->user(), $request->admin_notes);
        
        return redirect()->back()->with('success', 'Submission marked as under review');
    }
}
