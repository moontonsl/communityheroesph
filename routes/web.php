<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('homepage');
})->name('home');

Route::get('/homepage', function () {
    return Inertia::render('homepage');
})->name('homepage');

Route::get('/registerbarangay', function () {
    return Inertia::render('registerbarangay');
})->name('registerbarangay');

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
Route::get('/Transaction', function () {
    return Inertia::render('ch-transaction/chtransaction');
})->name('CHTransaction');

Route::get('/MyBarangay', function () {
    return Inertia::render('portal/chportal');
})->name('CHPortal');

// Additional transaction pages
Route::get('/apply-event', function () {
    return Inertia::render('apply-event');
})->name('apply-event');

Route::get('/my-barangays', function () {
    return Inertia::render('my-barangays');
})->name('my-barangays');

// Location API routes
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

// File upload and form submission routes
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
    
    // Get submission statistics
    Route::get('/api/admin/submissions/stats', function () {
        $stats = [
            'total' => \App\Models\BarangaySubmission::count(),
            'pending' => \App\Models\BarangaySubmission::pending()->count(),
            'approved' => \App\Models\BarangaySubmission::approved()->count(),
            'rejected' => \App\Models\BarangaySubmission::rejected()->count(),
            'under_review' => \App\Models\BarangaySubmission::underReview()->count(),
            'this_month' => \App\Models\BarangaySubmission::whereMonth('created_at', now()->month)->count(),
            'this_week' => \App\Models\BarangaySubmission::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count()
        ];
        
        return response()->json($stats);
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
