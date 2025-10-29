<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [App\Http\Controllers\HomepageController::class, 'index'])->name('home');
    Route::get('/homepage', [App\Http\Controllers\HomepageController::class, 'index'])->name('homepage');
});

// Barangay Application Routes - Area Admin, Community Lead, Super Admin A
Route::middleware(['auth', 'verified', 'role:barangays.apply'])->group(function () {
    Route::get('/registerbarangay', function (Request $request) {
        $preFillData = null;
        
        // Check if there's pre-fill data in the request
        if ($request->has('prefill')) {
            $preFillData = json_decode($request->get('prefill'), true);
        }
        
        return Inertia::render('registerbarangay', [
            'preFillData' => $preFillData
        ]);
    })->name('registerbarangay');
});

// Event Application Routes - Area Admin, Community Lead, Super Admin A
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/apply-event', function () {
        // Get approved barangays for the current user
        $approvedBarangays = \App\Models\BarangaySubmission::where('status', 'APPROVED')
            ->with(['region', 'province', 'municipality', 'barangay'])
            ->get();
        
        \Log::info('=== APPLY EVENT ROUTE DEBUG ===');
        \Log::info('Approved barangays count: ' . $approvedBarangays->count());
        \Log::info('Approved barangays data: ', $approvedBarangays->toArray());
        \Log::info('=== END ROUTE DEBUG ===');
        
        return Inertia::render('apply-event', [
            'approvedBarangays' => $approvedBarangays
        ]);
    })->name('apply-event');
});

Route::middleware(['auth', 'verified', 'redirect.admin'])->group(function () {
    Route::get('/', [App\Http\Controllers\HomepageController::class, 'index'])->name('home');
    
    // Admin routes - Community Lead, Super Admin A, Super Admin B
    Route::prefix('admin')->name('admin.')->middleware('admin')->group(function () {
        // Submission viewing - Community Lead, Super Admin A, Super Admin B
        Route::middleware('role:submissions.read')->group(function () {
            Route::get('/submissions', [App\Http\Controllers\Admin\SubmissionController::class, 'index'])->name('submissions.index');
            Route::get('/submissions/{id}', [App\Http\Controllers\Admin\SubmissionController::class, 'show'])->name('submissions.show');
        });
        
        // Pre-approval - Community Lead only
        Route::middleware('role:submissions.pre_approve')->group(function () {
            Route::post('/submissions/{id}/pre-approve', [App\Http\Controllers\Admin\SubmissionController::class, 'preApprove'])->name('submissions.pre-approve');
        });
        
        // Final approval - Super Admin A only
        Route::middleware('role:submissions.final_approve')->group(function () {
            Route::post('/submissions/{id}/approve', [App\Http\Controllers\Admin\SubmissionController::class, 'approve'])->name('submissions.approve');
            Route::post('/submissions/{id}/reject', [App\Http\Controllers\Admin\SubmissionController::class, 'reject'])->name('submissions.reject');
            Route::post('/submissions/{id}/review', [App\Http\Controllers\Admin\SubmissionController::class, 'markUnderReview'])->name('submissions.review');
        });
        
        // Account Management routes - Super Admin A & B only
        Route::middleware('role:settings.read')->group(function () {
            Route::get('/account-management', [App\Http\Controllers\Admin\AccountManagementController::class, 'index'])->name('account-management');
            Route::post('/account-management', [App\Http\Controllers\Admin\AccountManagementController::class, 'store'])->name('account-management.store');
            Route::put('/account-management/{user}', [App\Http\Controllers\Admin\AccountManagementController::class, 'update'])->name('account-management.update');
            Route::put('/account-management/{user}/password', [App\Http\Controllers\Admin\AccountManagementController::class, 'updatePassword'])->name('account-management.password');
            Route::patch('/account-management/{user}/toggle-status', [App\Http\Controllers\Admin\AccountManagementController::class, 'toggleStatus'])->name('account-management.toggle-status');
            Route::delete('/account-management/{user}', [App\Http\Controllers\Admin\AccountManagementController::class, 'destroy'])->name('account-management.destroy');
        });
        
        // Role Management routes
        Route::get('/roles', [App\Http\Controllers\Admin\RoleManagementController::class, 'index'])->name('roles');
        Route::post('/roles', [App\Http\Controllers\Admin\RoleManagementController::class, 'store'])->name('roles.store');
        Route::put('/roles/{role}', [App\Http\Controllers\Admin\RoleManagementController::class, 'update'])->name('roles.update');
        Route::patch('/roles/{role}/toggle-status', [App\Http\Controllers\Admin\RoleManagementController::class, 'toggleStatus'])->name('roles.toggle-status');
        Route::delete('/roles/{role}', [App\Http\Controllers\Admin\RoleManagementController::class, 'destroy'])->name('roles.destroy');
        
        // Airtable Management routes - Super Admin only
        Route::middleware('role:settings.read')->group(function () {
            Route::get('/airtable', function () {
                return Inertia::render('admin/airtable-management');
            })->name('airtable.management');
            Route::get('/airtable/status', [App\Http\Controllers\Admin\AirtableController::class, 'getStatus'])->name('airtable.status');
            Route::post('/airtable/test', [App\Http\Controllers\Admin\AirtableController::class, 'testConnection'])->name('airtable.test');
            Route::post('/airtable/sync-all', [App\Http\Controllers\Admin\AirtableController::class, 'syncAll'])->name('airtable.sync-all');
            Route::post('/airtable/sync-submission/{id}', [App\Http\Controllers\Admin\AirtableController::class, 'syncBarangaySubmission'])->name('airtable.sync-submission');
            Route::post('/airtable/sync-event/{id}', [App\Http\Controllers\Admin\AirtableController::class, 'syncEvent'])->name('airtable.sync-event');
            
            // New endpoints for getting and updating records
            Route::get('/airtable/record/{submissionId}', [App\Http\Controllers\Admin\AirtableController::class, 'getRecord'])->name('airtable.get-record');
            Route::put('/airtable/update-status/{submissionId}', [App\Http\Controllers\Admin\AirtableController::class, 'updateStatus'])->name('airtable.update-status');
            Route::get('/airtable/submissions', [App\Http\Controllers\Admin\AirtableController::class, 'getSubmissions'])->name('airtable.get-submissions');
        });
    });
});
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/Transaction', function () {
        return Inertia::render('ch-transaction/chtransaction');
    })->name('CHTransaction');

    // Portal access - Community Lead, Super Admin A, Super Admin B
    Route::middleware(['auth', 'verified', 'role:submissions.read'])->group(function () {
        Route::get('/MyBarangay', function () {
        // Get authenticated user with role information
        $user = auth()->user()->load('role');
        $userRole = $user->role->slug ?? '';
        
        // Fetch barangay submissions with related data based on user role
        $submissionsQuery = \App\Models\BarangaySubmission::with(['region', 'province', 'municipality', 'barangay', 'approvedBy', 'reviewedBy', 'assignedUser']);
        
        // Filter submissions based on role
        if ($userRole === 'area-admin') {
            // Area Admin only sees their own assigned submissions
            $submissionsQuery->where('assigned_user_id', $user->id);
        } elseif ($userRole === 'community-lead') {
            // Community Lead sees PENDING submissions from Area Admins AND their own PRE_APPROVED submissions
            $submissionsQuery->where(function($query) use ($user) {
                $query->where('status', 'PENDING')
                      ->where('assigned_user_id', '!=', $user->id)
                      ->orWhere(function($subQuery) use ($user) {
                          $subQuery->where('status', 'PRE_APPROVED')
                                   ->where('reviewed_by', $user->id);
                      });
            });
        } elseif ($userRole === 'super-admin-a' || $userRole === 'super-admin') {
            // Super Admin A and Super Admin only see PRE_APPROVED submissions for final approval
            $submissionsQuery->where('status', 'PRE_APPROVED');
        } elseif ($userRole === 'super-admin-b') {
            // Super Admin B sees all submissions
            // No additional filtering needed
        }
        
        $submissions = $submissionsQuery->orderBy('created_at', 'desc')->get();
        
        // Get all submissions for master list (unfiltered)
        $allSubmissions = \App\Models\BarangaySubmission::with(['region', 'province', 'municipality', 'barangay', 'approvedBy', 'reviewedBy', 'assignedUser'])
            ->orderBy('created_at', 'desc')
            ->get();
        
        // Fetch events with related data based on user role
        $eventsQuery = \App\Models\Event::with([
            'barangaySubmission',
            'barangaySubmission.region', 
            'barangaySubmission.province', 
            'barangaySubmission.municipality', 
            'barangaySubmission.barangay', 
            'appliedBy', 
            'assignedUser',
            'approvedBy', 
            'reviewedBy'
        ]);
        
        // Filter events based on role
        if ($userRole === 'area-admin') {
            // Area Admin only sees events assigned to them
            $eventsQuery->where('assigned_user_id', $user->id);
        } elseif ($userRole === 'community-lead') {
            // Community Lead sees PENDING events from Area Admins AND their own PRE_APPROVED events
            $eventsQuery->where(function($query) use ($user) {
                $query->where('status', 'PENDING')
                      ->where('assigned_user_id', '!=', $user->id)
                      ->orWhere(function($subQuery) use ($user) {
                          $subQuery->where('status', 'PRE_APPROVED')
                                   ->where('reviewed_by', $user->id);
                      });
            });
        } elseif ($userRole === 'super-admin-a' || $userRole === 'super-admin') {
            // Super Admin A and Super Admin only see PRE_APPROVED events for final approval
            $eventsQuery->where('status', 'PRE_APPROVED');
        } elseif ($userRole === 'super-admin-b') {
            // Super Admin B sees all events
            // No additional filtering needed
        }
        
        $events = $eventsQuery->orderBy('created_at', 'desc')->get();
        
        // Get all events for master list (unfiltered)
        $allEvents = \App\Models\Event::with([
            'barangaySubmission',
            'barangaySubmission.region', 
            'barangaySubmission.province', 
            'barangaySubmission.municipality', 
            'barangaySubmission.barangay', 
            'appliedBy', 
            'assignedUser',
            'approvedBy', 
            'reviewedBy'
        ])->orderBy('created_at', 'desc')->get();
        
        // Get statistics for barangay submissions based on user role
        $submissionStatsQuery = \App\Models\BarangaySubmission::query();
        
        if ($userRole === 'area-admin') {
            $submissionStatsQuery->where('assigned_user_id', $user->id);
        } elseif ($userRole === 'community-lead') {
            $submissionStatsQuery->where(function($query) use ($user) {
                $query->where('status', 'PENDING')
                      ->where('assigned_user_id', '!=', $user->id)
                      ->orWhere(function($subQuery) use ($user) {
                          $subQuery->where('status', 'PRE_APPROVED')
                                   ->where('reviewed_by', $user->id);
                      });
            });
        } elseif ($userRole === 'super-admin-a' || $userRole === 'super-admin') {
            $submissionStatsQuery->where('status', 'PRE_APPROVED');
        } elseif ($userRole === 'super-admin-b') {
            // Super Admin B sees all submissions - no filtering needed
        }
        
        $submissionStats = [
            'total' => $submissionStatsQuery->count(),
            'pending' => $submissionStatsQuery->clone()->pending()->count(),
            'pre_approved' => $submissionStatsQuery->clone()->preApproved()->count(),
            'approved' => $submissionStatsQuery->clone()->approved()->count(),
            'rejected' => $submissionStatsQuery->clone()->rejected()->count(),
            'under_review' => $submissionStatsQuery->clone()->underReview()->count(),
            'renew' => $submissionStatsQuery->clone()->renew()->count(),
            'this_month' => $submissionStatsQuery->clone()->whereMonth('created_at', now()->month)->count(),
            'this_week' => $submissionStatsQuery->clone()->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count()
        ];
        
        // Get statistics for all submissions (for master list)
        $allSubmissionStats = [
            'total' => \App\Models\BarangaySubmission::count(),
            'pending' => \App\Models\BarangaySubmission::pending()->count(),
            'pre_approved' => \App\Models\BarangaySubmission::preApproved()->count(),
            'approved' => \App\Models\BarangaySubmission::approved()->count(),
            'rejected' => \App\Models\BarangaySubmission::rejected()->count(),
            'under_review' => \App\Models\BarangaySubmission::underReview()->count(),
            'renew' => \App\Models\BarangaySubmission::renew()->count(),
            'this_month' => \App\Models\BarangaySubmission::whereMonth('created_at', now()->month)->count(),
            'this_week' => \App\Models\BarangaySubmission::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count()
        ];
        
        // Get statistics for events based on user role (same filtering as events query)
        $eventStatsQuery = \App\Models\Event::query();
        
        // Apply same filtering as events query for statistics
        if ($userRole === 'area-admin') {
            $eventStatsQuery->where('assigned_user_id', $user->id);
        } elseif ($userRole === 'community-lead') {
            $eventStatsQuery->where(function($query) use ($user) {
                $query->where('status', 'PENDING')
                      ->where('assigned_user_id', '!=', $user->id)
                      ->orWhere(function($subQuery) use ($user) {
                          $subQuery->where('status', 'PRE_APPROVED')
                                   ->where('reviewed_by', $user->id);
                      });
            });
        } elseif ($userRole === 'super-admin-a' || $userRole === 'super-admin') {
            $eventStatsQuery->where('status', 'PRE_APPROVED');
        } elseif ($userRole === 'super-admin-b') {
            // Super Admin B sees all events - no filtering needed
        }
        
        $eventStats = [
            'total' => $eventStatsQuery->count(),
            'pending' => $userRole === 'community-lead' ? 
                \App\Models\Event::where('status', 'PENDING')->where('applied_by', '!=', $user->id)->count() :
                $eventStatsQuery->clone()->pending()->count(),
            'pre_approved' => $userRole === 'community-lead' ? 
                \App\Models\Event::where('status', 'PRE_APPROVED')->where('applied_by', $user->id)->count() :
                $eventStatsQuery->clone()->preApproved()->count(),
            'approved' => $eventStatsQuery->clone()->approved()->count(),
            'rejected' => $eventStatsQuery->clone()->rejected()->count(),
            'completed' => $eventStatsQuery->clone()->completed()->count(),
            'cancelled' => $eventStatsQuery->clone()->cancelled()->count(),
            'cleared' => $eventStatsQuery->clone()->cleared()->count(),
            'this_month' => $eventStatsQuery->clone()->whereMonth('created_at', now()->month)->count(),
            'this_week' => $eventStatsQuery->clone()->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count()
        ];
        
        // Get statistics for all events (for master list)
        $allEventStats = [
            'total' => \App\Models\Event::count(),
            'pending' => \App\Models\Event::pending()->count(),
            'pre_approved' => \App\Models\Event::preApproved()->count(),
            'approved' => \App\Models\Event::approved()->count(),
            'rejected' => \App\Models\Event::rejected()->count(),
            'completed' => \App\Models\Event::completed()->count(),
            'cancelled' => \App\Models\Event::cancelled()->count(),
            'cleared' => \App\Models\Event::cleared()->count(),
            'this_month' => \App\Models\Event::whereMonth('created_at', now()->month)->count(),
            'this_week' => \App\Models\Event::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count()
        ];
        
        return Inertia::render('portal/chportal', [
            'submissions' => $submissions,
            'events' => $events,
            'allSubmissions' => $allSubmissions,
            'allEvents' => $allEvents,
            'submissionStats' => $submissionStats,
            'eventStats' => $eventStats,
            'allSubmissionStats' => $allSubmissionStats,
            'allEventStats' => $allEventStats,
            'user' => $user
        ]);
    })->name('CHPortal');
    });

    Route::get('/my-barangays', function () {
        return Inertia::render('my-barangays');
    })->name('my-barangays');
});

// Event Reporting Routes - Area Admin and Community Lead only
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('event-reporting')->name('event-reporting.')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\EventReportingController::class, 'index'])->name('index');
        Route::get('/create', [App\Http\Controllers\Admin\EventReportingController::class, 'create'])->name('create');
        Route::post('/', [App\Http\Controllers\Admin\EventReportingController::class, 'store'])->name('store');
        Route::get('/{id}', [App\Http\Controllers\Admin\EventReportingController::class, 'show'])->name('show');
        Route::get('/{id}/edit', [App\Http\Controllers\Admin\EventReportingController::class, 'edit'])->name('edit');
        Route::put('/{id}', [App\Http\Controllers\Admin\EventReportingController::class, 'update'])->name('update');
        Route::post('/{id}/submit', [App\Http\Controllers\Admin\EventReportingController::class, 'submit'])->name('submit');
        Route::delete('/{id}', [App\Http\Controllers\Admin\EventReportingController::class, 'destroy'])->name('destroy');
        
        // Admin actions
        Route::post('/{id}/pre-approve', [App\Http\Controllers\Admin\EventReportingController::class, 'preApprove'])->name('pre-approve');
        Route::post('/{id}/review', [App\Http\Controllers\Admin\EventReportingController::class, 'review'])->name('review');
        Route::post('/{id}/approve', [App\Http\Controllers\Admin\EventReportingController::class, 'approve'])->name('approve');
        
        // Super Admin financial and clearance actions
        Route::put('/{id}/financials', [App\Http\Controllers\Admin\EventReportingController::class, 'updateFinancials'])->name('update-financials');
        Route::post('/{id}/first-clearance', [App\Http\Controllers\Admin\EventReportingController::class, 'firstClearance'])->name('first-clearance');
        Route::post('/{id}/final-clearance', [App\Http\Controllers\Admin\EventReportingController::class, 'finalClearance'])->name('final-clearance');
    });
});

// Event Report Review Routes - Super Admin only
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('event-report-review')->name('event-report-review.')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\EventReportReviewController::class, 'index'])->name('index');
        Route::get('/{id}', [App\Http\Controllers\Admin\EventReportReviewController::class, 'show'])->name('show');
        Route::post('/{id}/review', [App\Http\Controllers\Admin\EventReportReviewController::class, 'review'])->name('review');
        Route::post('/{id}/approve', [App\Http\Controllers\Admin\EventReportReviewController::class, 'approve'])->name('approve');
        Route::post('/{id}/first-clearance', [App\Http\Controllers\Admin\EventReportReviewController::class, 'firstClearance'])->name('first-clearance');
        Route::post('/{id}/final-clearance', [App\Http\Controllers\Admin\EventReportReviewController::class, 'finalClearance'])->name('final-clearance');
        Route::put('/{id}/financials', [App\Http\Controllers\Admin\EventReportReviewController::class, 'updateFinancials'])->name('update-financials');
    });
});

// Location API routes - Protected
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/api/regions', function () {
        return \App\Models\Region::select('id', 'name', 'code')->orderBy('name')->get();
    });

    Route::get('/api/users', function () {
        return \App\Models\User::with('role')->get(['id', 'name', 'role_id'])->map(function($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'role' => $user->role ? $user->role->name : 'No Role'
            ];
        });
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

    Route::post('/api/upload-post-event-file', function () {
        $request = request();
        
        try {
            // Validate file
            $request->validate([
                'post_event_file' => 'required|file|mimes:pdf|max:10240' // 10MB max
            ]);
            
            // Store file
            $file = $request->file('post_event_file');
            $fileName = 'post_event_' . time() . '_' . uniqid() . '.pdf';
            $filePath = $file->storeAs('post_event_files', $fileName, 'public');
            
            return response()->json([
                'success' => true,
                'file_path' => $filePath,
                'file_name' => $fileName
            ]);
        } catch (\Exception $e) {
            \Log::error('Post event file upload error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error uploading post event file: ' . $e->getMessage()
            ], 500);
        }
    });

    // Upload MOA file for Community Lead pre-approval
    Route::post('/api/upload-moa', function () {
        $request = request();
        
        // Debug logging
        \Log::info('MOA upload request received', [
            'has_file' => $request->hasFile('moa_file'),
            'file_name' => $request->file('moa_file') ? $request->file('moa_file')->getClientOriginalName() : 'no file',
            'file_size' => $request->file('moa_file') ? $request->file('moa_file')->getSize() : 0
        ]);
        
        try {
            // Validate file
            $request->validate([
                'moa_file' => 'required|file|mimes:pdf|max:10240' // 10MB max
            ]);
            
            // Store file
            $file = $request->file('moa_file');
            $fileName = 'moa_' . time() . '_' . uniqid() . '.pdf';
            $filePath = $file->storeAs('moa_files', $fileName, 'public');
            
            return response()->json([
                'success' => true,
                'file_path' => $filePath,
                'file_name' => $fileName
            ]);
        } catch (\Exception $e) {
            \Log::error('MOA upload error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error uploading MOA file: ' . $e->getMessage()
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
            'assigned_user_id' => 'required|exists:users,id',
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
                'assigned_user_id' => $request->assigned_user_id,
                'moa_file_path' => $request->moa_file_path,
                'moa_file_name' => $request->moa_file_name,
                'submitted_from_ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'status' => 'PENDING'
            ]);
            
            // Sync to Airtable if enabled
            if (config('airtable.sync.enabled', true)) {
                try {
                    \App\Jobs\SyncToAirtableJob::dispatch('barangay_submission', $submission->id, 'create');
                    \Log::info('Airtable sync job dispatched for barangay submission', [
                        'submission_id' => $submission->submission_id,
                        'id' => $submission->id
                    ]);
                } catch (\Exception $e) {
                    \Log::error('Failed to dispatch Airtable sync job', [
                        'submission_id' => $submission->submission_id,
                        'error' => $e->getMessage()
                    ]);
                    // Don't fail the main request if Airtable sync fails
                }
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Barangay registration submitted successfully for approval',
                'submission_id' => $submission->submission_id,
                'airtable_sync' => config('airtable.sync.enabled', true) ? 'queued' : 'disabled',
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
                'campaign' => 'required|string|max:255',
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
            
            // Determine initial status based on user role
            $user = auth()->user();
            $initialStatus = 'PENDING'; // Default for Area Admin
            
            if ($user->role && $user->role->slug === 'community-lead') {
                $initialStatus = 'PRE_APPROVED'; // Community Lead applications go directly to pre-approved
            } elseif ($user->role && $user->role->slug === 'super-admin-a') {
                $initialStatus = 'PRE_APPROVED'; // Super Admin A applications go directly to pre-approved
            }
            
            // Create event application
            $event = \App\Models\Event::create([
                'barangay_submission_id' => $request->barangay_submission_id,
                'applied_by' => auth()->id(),
                'assigned_user_id' => auth()->id(), // Automatically assign the logged-in user
                'event_name' => $request->event_name,
                'event_description' => $request->event_description,
                'event_date' => $request->event_date,
                'campaign' => $request->campaign,
                'event_location' => $request->event_location,
                'expected_participants' => $request->expected_participants,
                'event_type' => $request->event_type,
                'contact_person' => $request->contact_person,
                'contact_number' => $request->contact_number,
                'contact_email' => $request->contact_email,
                'requirements' => $request->requirements,
                'proposal_file_path' => $request->proposal_file_path,
                'proposal_file_name' => $request->proposal_file_name,
                'status' => $initialStatus
            ]);
            
            // Sync to Airtable if enabled
            if (config('airtable.sync.enabled', true)) {
                try {
                    \App\Jobs\SyncToAirtableJob::dispatch('event', $event->id, 'create');
                    \Log::info('Airtable sync job dispatched for event', [
                        'event_id' => $event->event_id,
                        'id' => $event->id
                    ]);
                } catch (\Exception $e) {
                    \Log::error('Failed to dispatch Airtable sync job for event', [
                        'event_id' => $event->event_id,
                        'error' => $e->getMessage()
                    ]);
                    // Don't fail the main request if Airtable sync fails
                }
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Event application submitted successfully for approval',
                'event_id' => $event->event_id,
                'airtable_sync' => config('airtable.sync.enabled', true) ? 'queued' : 'disabled',
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
        $user = auth()->user();
        $userRole = $user->role->slug;
        
        $request->validate([
            'admin_notes' => 'nullable|string|max:1000',
            'moa_file_path' => 'nullable|string',
            'moa_file_name' => 'nullable|string'
        ]);
        
        // Update submission with MOA file info if provided (Community Lead pre-approval)
        $updateData = ['admin_notes' => $request->admin_notes];
        if ($request->moa_file_path && $request->moa_file_name) {
            $updateData['moa_file_path'] = $request->moa_file_path;
            $updateData['moa_file_name'] = $request->moa_file_name;
        }
        
        // Determine approval type based on user role and current status
        if ($userRole === 'community-lead' && $submission->status === 'PENDING') {
            // Community Lead pre-approval (no MOA upload required)
            $submission->preApprove($user, $request->admin_notes);
        } elseif (($userRole === 'super-admin-a' || $userRole === 'super-admin') && $submission->status === 'PRE_APPROVED') {
            // Super Admin final approval - MOA upload required
            if (!$request->moa_file_path || !$request->moa_file_name) {
                return response()->json([
                    'success' => false,
                    'message' => 'Signed MOA PDF file is required for final approval'
                ], 400);
            }
            $submission->approve($user, $request->admin_notes);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Invalid approval action for current user role and submission status'
            ], 400);
        }
        
        // Update MOA file info if provided
        if ($request->moa_file_path && $request->moa_file_name) {
            $submission->update([
                'moa_file_path' => $request->moa_file_path,
                'moa_file_name' => $request->moa_file_name
            ]);
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Submission approved successfully',
            'submission' => $submission->fresh(['approvedBy', 'reviewedBy'])
        ]);
    });
    
    // Renew MOA route (Super Admin A only)
    Route::post('/api/admin/submissions/{id}/renew', function ($id) {
        $request = request();
        $submission = \App\Models\BarangaySubmission::findOrFail($id);
        $user = auth()->user();
        $userRole = $user->role->slug;
        
        // Only Super Admin A can renew MOAs
        if ($userRole !== 'super-admin-a' && $userRole !== 'super-admin') {
            return response()->json([
                'success' => false,
                'message' => 'Only Super Admin can renew MOAs'
            ], 403);
        }
        
        // Only RENEW status can be renewed
        if ($submission->status !== 'RENEW') {
            return response()->json([
                'success' => false,
                'message' => 'Only expired MOAs can be renewed'
            ], 400);
        }
        
        $request->validate([
            'admin_notes' => 'nullable|string|max:1000'
        ]);
        
        $submission->renewMoa($user, $request->admin_notes);
        
        return response()->json([
            'success' => true,
            'message' => 'MOA renewed successfully for 1 year',
            'submission' => $submission->fresh(['approvedBy', 'reviewedBy'])
        ]);
    });
    
    // Event pre-approval route (Community Lead only)
    Route::post('/api/admin/events/{id}/pre-approve', function ($id) {
        $request = request();
        
        try {
            $event = \App\Models\Event::findOrFail($id);
            
            $request->validate([
                'admin_notes' => 'nullable|string|max:1000'
            ]);
            
            // Community Lead pre-approval (no MOA upload required)
            $event->preApprove(auth()->user(), $request->admin_notes);
            
            return response()->json([
                'success' => true,
                'message' => 'Event pre-approved successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Event pre-approval failed', [
                'event_id' => $id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to pre-approve event'
            ], 500);
        }
    });
    
    // Event final approval route (Super Admin only)
    Route::post('/api/admin/events/{id}/approve', function ($id) {
        $request = request();
        
        // Debug logging
        \Log::info('Event final approval request received', [
            'event_id' => $id,
            'request_data' => $request->all(),
            'user_role' => auth()->user()->role->slug ?? 'no-role'
        ]);
        
        try {
            $event = \App\Models\Event::findOrFail($id);
            
            $request->validate([
                'admin_notes' => 'nullable|string|max:1000',
                'moa_file_path' => 'required|string',
                'moa_file_name' => 'required|string'
            ]);
            
            // Super Admin final approval - MOA upload required
            $event->approve(auth()->user(), $request->admin_notes);
            
            // Update event with MOA file info
            $event->update([
                'moa_file_path' => $request->moa_file_path,
                'moa_file_name' => $request->moa_file_name
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Event approved successfully with signed MOA'
            ]);
        } catch (\Exception $e) {
            \Log::error('Event final approval failed', [
                'event_id' => $id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve event'
            ], 500);
        }
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
