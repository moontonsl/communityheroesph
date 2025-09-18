<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('homepage');
    })->name('home');

    Route::get('/homepage', function () {
        return Inertia::render('homepage');
    })->name('homepage');

    Route::get('/registerbarangay', function () {
        return Inertia::render('registerbarangay');
    })->name('registerbarangay');
});

Route::middleware(['auth', 'verified', 'redirect.admin'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Admin routes
    Route::prefix('admin')->name('admin.')->middleware('admin')->group(function () {
        Route::get('/submissions', [App\Http\Controllers\Admin\SubmissionController::class, 'index'])->name('submissions.index');
        Route::get('/submissions/{id}', [App\Http\Controllers\Admin\SubmissionController::class, 'show'])->name('submissions.show');
        Route::post('/submissions/{id}/approve', [App\Http\Controllers\Admin\SubmissionController::class, 'approve'])->name('submissions.approve');
        Route::post('/submissions/{id}/reject', [App\Http\Controllers\Admin\SubmissionController::class, 'reject'])->name('submissions.reject');
        Route::post('/submissions/{id}/review', [App\Http\Controllers\Admin\SubmissionController::class, 'markUnderReview'])->name('submissions.review');
    });
});
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/Transaction', function () {
        return Inertia::render('ch-transaction/chtransaction');
    })->name('CHTransaction');

    Route::get('/MyBarangay', function () {
        // Fetch barangay submissions with related data
        $submissions = \App\Models\BarangaySubmission::with(['region', 'province', 'municipality', 'barangay', 'approvedBy', 'reviewedBy'])
            ->orderBy('created_at', 'desc')
            ->get();
        
        // Fetch events with related data
        $events = \App\Models\Event::with([
            'barangaySubmission',
            'barangaySubmission.region', 
            'barangaySubmission.province', 
            'barangaySubmission.municipality', 
            'barangaySubmission.barangay', 
            'appliedBy', 
            'approvedBy', 
            'reviewedBy'
        ])
            ->orderBy('created_at', 'desc')
            ->get();
        
        // Get statistics for barangay submissions
        $submissionStats = [
            'total' => \App\Models\BarangaySubmission::count(),
            'pending' => \App\Models\BarangaySubmission::pending()->count(),
            'approved' => \App\Models\BarangaySubmission::approved()->count(),
            'rejected' => \App\Models\BarangaySubmission::rejected()->count(),
            'under_review' => \App\Models\BarangaySubmission::underReview()->count(),
            'this_month' => \App\Models\BarangaySubmission::whereMonth('created_at', now()->month)->count(),
            'this_week' => \App\Models\BarangaySubmission::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count()
        ];
        
        // Get statistics for events
        $eventStats = [
            'total' => \App\Models\Event::count(),
            'pending' => \App\Models\Event::pending()->count(),
            'approved' => \App\Models\Event::approved()->count(),
            'rejected' => \App\Models\Event::rejected()->count(),
            'completed' => \App\Models\Event::completed()->count(),
            'cancelled' => \App\Models\Event::cancelled()->count(),
            'this_month' => \App\Models\Event::whereMonth('created_at', now()->month)->count(),
            'this_week' => \App\Models\Event::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count()
        ];
        
        // Get authenticated user with role information
        $user = auth()->user()->load('role');
        
        return Inertia::render('portal/chportal', [
            'submissions' => $submissions,
            'events' => $events,
            'submissionStats' => $submissionStats,
            'eventStats' => $eventStats,
            'user' => $user
        ]);
    })->name('CHPortal');

    // Additional transaction pages
    Route::get('/apply-event', function () {
        // Get approved barangays that belong to the current user (community admin)
        $user = auth()->user();
        
        // For now, we'll get all approved barangays
        // In a real system, you'd link barangays to specific community admins
        $approvedBarangays = \App\Models\BarangaySubmission::where('status', 'APPROVED')
            ->with(['region', 'province', 'municipality', 'barangay'])
            ->get();
        
        return Inertia::render('apply-event', [
            'approvedBarangays' => $approvedBarangays
        ]);
    })->name('apply-event');

    Route::get('/my-barangays', function () {
        return Inertia::render('my-barangays');
    })->name('my-barangays');
});

// Location API routes - Protected
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/api/regions', function () {
        return \App\Models\Region::select('id', 'name', 'code')->orderBy('name')->get();
    });

    Route::get('/api/provinces/{regionId}', function ($regionId) {
        return \App\Models\Province::where('region_id', $regionId)
            ->select('id', 'name', 'code')
            ->orderBy('name')
            ->get();
    });

    Route::get('/api/municipalities/{provinceId}', function ($provinceId) {
        return \App\Models\Municipality::where('province_id', $provinceId)
            ->select('id', 'name', 'code')
            ->orderBy('name')
            ->get();
    });

    Route::get('/api/barangays/{municipalityId}', function ($municipalityId) {
        return \App\Models\Barangay::where('municipality_id', $municipalityId)
            ->select('id', 'name', 'psgc_code', 'population')
            ->orderBy('name')
            ->get();
    });

    // Search endpoints for autocomplete
    Route::get('/api/regions/search', function () {
        $query = request('q', '');
        return \App\Models\Region::where('name', 'like', "%{$query}%")
            ->select('id', 'name', 'code')
            ->orderBy('name')
            ->limit(20)
            ->get();
    });

    Route::get('/api/provinces/search/{regionId}', function ($regionId) {
        $query = request('q', '');
        return \App\Models\Province::where('region_id', $regionId)
            ->where('name', 'like', "%{$query}%")
            ->select('id', 'name', 'code')
            ->orderBy('name')
            ->limit(20)
            ->get();
    });

    Route::get('/api/municipalities/search/{provinceId}', function ($provinceId) {
        $query = request('q', '');
        return \App\Models\Municipality::where('province_id', $provinceId)
            ->where('name', 'like', "%{$query}%")
            ->select('id', 'name', 'code')
            ->orderBy('name')
            ->limit(20)
            ->get();
    });

    Route::get('/api/barangays/search/{municipalityId}', function ($municipalityId) {
        $query = request('q', '');
        return \App\Models\Barangay::where('municipality_id', $municipalityId)
            ->where('name', 'like', "%{$query}%")
            ->select('id', 'name', 'psgc_code', 'population')
            ->orderBy('name')
            ->limit(20)
            ->get();
    });
});

// File upload and form submission routes - Protected
Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/api/upload-moa', function () {
        $request = request();
        
        // Validate file
        $request->validate([
            'moa_file' => 'required|file|mimes:pdf|max:10240' // 10MB max
        ]);
        
        // Store file
        $file = $request->file('moa_file');
        $fileName = time() . '_' . $file->getClientOriginalName();
        $filePath = $file->storeAs('moa_files', $fileName, 'public');
        
        return response()->json([
            'success' => true,
            'file_path' => $filePath,
            'file_name' => $fileName
        ]);
    });

    Route::post('/api/upload-proposal', function () {
        $request = request();
        
        try {
            // Validate file
            $request->validate([
                'proposal_file' => 'required|file|mimes:pdf|max:10240' // 10MB max
            ]);
            
            // Store file
            $file = $request->file('proposal_file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('proposal_files', $fileName, 'public');
            
            return response()->json([
                'success' => true,
                'file_path' => $filePath,
                'file_name' => $fileName
            ]);
        } catch (\Exception $e) {
            \Log::error('Proposal upload error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error uploading proposal file: ' . $e->getMessage()
            ], 500);
        }
    });

    Route::post('/api/register-barangay', function () {
        $request = request();
        
        // Validate form data
        $request->validate([
            'region_id' => 'required|exists:regions,id',
            'province_id' => 'required|exists:provinces,id',
            'municipality_id' => 'required|exists:municipalities,id',
            'barangay_id' => 'required|exists:barangays,id',
            'zip_code' => 'nullable|string|max:4',
            'population' => 'nullable|integer',
            'second_party_name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'date_signed' => 'required|date',
            'stage' => 'required|in:NEW,RENEWAL',
            'moa_file_path' => 'required|string',
            'moa_file_name' => 'required|string'
        ]);
        
        try {
            // Create submission record
            $submission = \App\Models\BarangaySubmission::create([
                'region_id' => $request->region_id,
                'province_id' => $request->province_id,
                'municipality_id' => $request->municipality_id,
                'barangay_id' => $request->barangay_id,
                'region_name' => $request->region_name,
                'province_name' => $request->province_name,
                'municipality_name' => $request->municipality_name,
                'barangay_name' => $request->barangay_name,
                'zip_code' => $request->zip_code,
                'population' => $request->population,
                'second_party_name' => $request->second_party_name,
                'position' => $request->position,
                'date_signed' => $request->date_signed,
                'stage' => $request->stage,
                'moa_file_path' => $request->moa_file_path,
                'moa_file_name' => $request->moa_file_name,
                'submitted_from_ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'status' => 'PENDING'
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Barangay registration submitted successfully for approval',
                'submission_id' => $submission->submission_id,
                'data' => [
                    'id' => $submission->id,
                    'submission_id' => $submission->submission_id,
                    'status' => $submission->status,
                    'submitted_at' => $submission->created_at->format('Y-m-d H:i:s')
                ]
            ]);
        } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error submitting registration. Please try again.',
            'error' => $e->getMessage()
        ], 500);
        }
    });

    // Event application submission
    Route::post('/api/apply-event', function () {
        $request = request();
        
        try {
            \Log::info('Event application request received', $request->all());
            
            // Validate form data
            $request->validate([
                'barangay_submission_id' => 'required|exists:barangay_submissions,id',
                'event_name' => 'required|string|max:255',
                'event_description' => 'required|string|max:1000',
                'event_date' => 'required|date|after_or_equal:today',
                'event_location' => 'required|string|max:255',
                'expected_participants' => 'required|integer|min:1|max:10000',
                'event_type' => 'nullable|string|max:100',
                'contact_person' => 'required|string|max:255',
                'contact_number' => 'required|string|max:20',
                'contact_email' => 'required|email|max:255',
                'requirements' => 'nullable|string|max:1000',
                'proposal_file_path' => 'required|string',
                'proposal_file_name' => 'required|string'
            ], [
                'event_date.after_or_equal' => 'The event date must be today or a future date.',
                'barangay_submission_id.exists' => 'Please select a valid barangay.',
                'expected_participants.min' => 'Expected participants must be at least 1.',
                'expected_participants.max' => 'Expected participants cannot exceed 10,000.',
                'contact_email.email' => 'Please enter a valid email address.',
                'proposal_file_path.required' => 'Please upload a proposal file.'
            ]);
            
            // Create event application
            $event = \App\Models\Event::create([
                'barangay_submission_id' => $request->barangay_submission_id,
                'applied_by' => auth()->id(),
                'event_name' => $request->event_name,
                'event_description' => $request->event_description,
                'event_date' => $request->event_date,
                'event_location' => $request->event_location,
                'expected_participants' => $request->expected_participants,
                'event_type' => $request->event_type,
                'contact_person' => $request->contact_person,
                'contact_number' => $request->contact_number,
                'contact_email' => $request->contact_email,
                'requirements' => $request->requirements,
                'proposal_file_path' => $request->proposal_file_path,
                'proposal_file_name' => $request->proposal_file_name,
                'status' => 'PENDING'
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Event application submitted successfully for approval',
                'event_id' => $event->event_id,
                'data' => [
                    'id' => $event->id,
                    'event_id' => $event->event_id,
                    'status' => $event->status,
                    'submitted_at' => $event->created_at->format('Y-m-d H:i:s')
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Event application error: ' . $e->getMessage(), [
                'request_data' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error submitting event application. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    });
});

// Admin approval routes
Route::middleware(['auth'])->group(function () {
    // Get all submissions for admin review
    Route::get('/api/admin/submissions', function () {
        $submissions = \App\Models\BarangaySubmission::with(['region', 'province', 'municipality', 'barangay', 'approvedBy', 'reviewedBy'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);
        
        return response()->json($submissions);
    });
    
    // Get specific submission details
    Route::get('/api/admin/submissions/{id}', function ($id) {
        $submission = \App\Models\BarangaySubmission::with(['region', 'province', 'municipality', 'barangay', 'approvedBy', 'reviewedBy'])
            ->findOrFail($id);
        
        return response()->json($submission);
    });
    
    // Approve submission
    Route::post('/api/admin/submissions/{id}/approve', function ($id) {
        $request = request();
        $submission = \App\Models\BarangaySubmission::findOrFail($id);
        
        $request->validate([
            'admin_notes' => 'nullable|string|max:1000'
        ]);
        
        $submission->approve(auth()->user(), $request->admin_notes);
        
        return response()->json([
            'success' => true,
            'message' => 'Submission approved successfully',
            'submission' => $submission->fresh(['approvedBy'])
        ]);
    });
    
    // Approve event
    Route::post('/api/admin/events/{id}/approve', function ($id) {
        $request = request();
        $event = \App\Models\Event::findOrFail($id);
        
        $request->validate([
            'admin_notes' => 'nullable|string|max:1000'
        ]);
        
        $event->approve(auth()->user(), $request->admin_notes);
        
        return response()->json([
            'success' => true,
            'message' => 'Event approved successfully',
            'event' => $event->fresh(['approvedBy'])
        ]);
    });
    
    // Reject event
    Route::post('/api/admin/events/{id}/reject', function ($id) {
        $request = request();
        $event = \App\Models\Event::findOrFail($id);
        
        $request->validate([
            'rejection_reason' => 'required|string|max:1000',
            'admin_notes' => 'nullable|string|max:1000'
        ]);
        
        $event->reject(auth()->user(), $request->rejection_reason, $request->admin_notes);
        
        return response()->json([
            'success' => true,
            'message' => 'Event rejected successfully',
            'event' => $event->fresh(['reviewedBy'])
        ]);
    });
    
    // Reject submission
    Route::post('/api/admin/submissions/{id}/reject', function ($id) {
        $request = request();
        $submission = \App\Models\BarangaySubmission::findOrFail($id);
        
        $request->validate([
            'rejection_reason' => 'required|string|max:1000',
            'admin_notes' => 'nullable|string|max:1000'
        ]);
        
        $submission->reject(auth()->user(), $request->rejection_reason, $request->admin_notes);
        
        return response()->json([
            'success' => true,
            'message' => 'Submission rejected successfully',
            'submission' => $submission->fresh(['reviewedBy'])
        ]);
    });
    
    // Mark as under review
    Route::post('/api/admin/submissions/{id}/review', function ($id) {
        $request = request();
        $submission = \App\Models\BarangaySubmission::findOrFail($id);
        
        $request->validate([
            'admin_notes' => 'nullable|string|max:1000'
        ]);
        
        $submission->markUnderReview(auth()->user(), $request->admin_notes);
        
        return response()->json([
            'success' => true,
            'message' => 'Submission marked as under review',
            'submission' => $submission->fresh(['reviewedBy'])
        ]);
    });
    
    // Delete submission
    Route::delete('/api/admin/submissions/{id}', function ($id) {
        $request = request();
        $submission = \App\Models\BarangaySubmission::findOrFail($id);
        
        $request->validate([
            'admin_notes' => 'required|string|max:1000'
        ]);
        
        // Store admin notes before deletion
        $submission->update([
            'admin_notes' => $request->admin_notes,
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now()
        ]);
        
        // Delete the submission
        $submission->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Submission deleted successfully'
        ]);
    });
    
    // Get submission statistics
    Route::get('/api/admin/submissions/stats', function () {
        $stats = [
            'total' => \App\Models\BarangaySubmission::count(),
            'pending' => \App\Models\BarangaySubmission::pending()->count(),
            'approved' => \App\Models\BarangaySubmission::approved()->count(),
            'rejected' => \App\Models\BarangaySubmission::rejected()->count(),
            'under_review' => \App\Models\BarangaySubmission::underReview()->count(),
            'bronze' => \App\Models\BarangaySubmission::bronze()->count(),
            'silver' => \App\Models\BarangaySubmission::silver()->count(),
            'gold' => \App\Models\BarangaySubmission::gold()->count(),
            'platinum' => \App\Models\BarangaySubmission::platinum()->count(),
            'this_month' => \App\Models\BarangaySubmission::whereMonth('created_at', now()->month)->count(),
            'this_week' => \App\Models\BarangaySubmission::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count()
        ];
        
        return response()->json($stats);
    });

    // Test route to increment successful events (for testing tier upgrades)
    Route::post('/api/admin/submissions/{id}/increment-events', function ($id) {
        $submission = \App\Models\BarangaySubmission::findOrFail($id);
        
        if ($submission->status !== 'APPROVED') {
            return response()->json([
                'success' => false,
                'message' => 'Only approved submissions can have events incremented'
            ], 400);
        }
        
        $submission->incrementSuccessfulEvents();
        
        return response()->json([
            'success' => true,
            'message' => 'Successful events incremented',
            'submission' => $submission->fresh()
        ]);
    });
});

// Serve uploaded files - Protected
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/storage/{path}', function ($path) {
        $filePath = storage_path('app/public/' . $path);
        
        if (!file_exists($filePath)) {
            abort(404);
        }
        
        return response()->file($filePath);
    })->where('path', '.*');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
