<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AirtableService;
use App\Models\BarangaySubmission;
use App\Models\Event;
use App\Models\EventReporting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AirtableController extends Controller
{
    protected AirtableService $airtableService;

    public function __construct(AirtableService $airtableService)
    {
        $this->airtableService = $airtableService;
    }

    /**
     * Test Airtable connection
     */
    public function testConnection()
    {
        try {
            $result = $this->airtableService->testConnection();
            
            return response()->json([
                'success' => $result['success'],
                'message' => $result['success'] ? 'Connection successful' : 'Connection failed',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error testing connection: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Sync all data to Airtable
     */
    public function syncAll()
    {
        try {
            $results = [
                'barangay_submissions' => 0,
                'events' => 0,
                'event_reports' => 0,
                'errors' => []
            ];

            // Sync barangay submissions
            $submissions = BarangaySubmission::all();
            foreach ($submissions as $submission) {
                try {
                    $result = $this->airtableService->syncBarangaySubmission($submission);
                    if ($result['success']) {
                        $results['barangay_submissions']++;
                    } else {
                        $results['errors'][] = "Barangay Submission {$submission->submission_id}: " . $result['error'];
                    }
                } catch (\Exception $e) {
                    $results['errors'][] = "Barangay Submission {$submission->submission_id}: " . $e->getMessage();
                }
            }

            // Sync events
            $events = Event::all();
            foreach ($events as $event) {
                try {
                    $result = $this->airtableService->syncEvent($event);
                    if ($result['success']) {
                        $results['events']++;
                    } else {
                        $results['errors'][] = "Event {$event->event_id}: " . $result['error'];
                    }
                } catch (\Exception $e) {
                    $results['errors'][] = "Event {$event->event_id}: " . $e->getMessage();
                }
            }

            // Sync event reports
            $reports = EventReporting::all();
            foreach ($reports as $report) {
                try {
                    $result = $this->airtableService->syncEventReporting($report);
                    if ($result['success']) {
                        $results['event_reports']++;
                    } else {
                        $results['errors'][] = "Event Report {$report->report_id}: " . $result['error'];
                    }
                } catch (\Exception $e) {
                    $results['errors'][] = "Event Report {$report->report_id}: " . $e->getMessage();
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Sync completed',
                'results' => $results
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error during sync: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Sync specific barangay submission
     */
    public function syncBarangaySubmission(Request $request, $id)
    {
        try {
            $submission = BarangaySubmission::findOrFail($id);
            $result = $this->airtableService->syncBarangaySubmission($submission);
            
            return response()->json([
                'success' => $result['success'],
                'message' => $result['success'] ? 'Synced successfully' : 'Sync failed',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error syncing submission: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Sync specific event
     */
    public function syncEvent(Request $request, $id)
    {
        try {
            $event = Event::findOrFail($id);
            $result = $this->airtableService->syncEvent($event);
            
            return response()->json([
                'success' => $result['success'],
                'message' => $result['success'] ? 'Synced successfully' : 'Sync failed',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error syncing event: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get sync status
     */
    public function getStatus()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'enabled' => config('airtable.sync.enabled', true),
                'base_id' => config('airtable.base_id') ? 'Set' : 'Not set',
                'api_key' => config('airtable.api_key') ? 'Set' : 'Not set',
                'queue' => config('airtable.sync.queue', 'default'),
                'retry_attempts' => config('airtable.sync.retry_attempts', 3),
            ]
        ]);
    }

    /**
     * Get a specific record from Airtable by Submission ID
     */
    public function getRecord(Request $request, $submissionId)
    {
        try {
            $result = $this->airtableService->getRecordBySubmissionId($submissionId);
            
            return response()->json([
                'success' => $result['success'],
                'message' => $result['success'] ? 'Record found' : 'Record not found',
                'data' => $result['data'] ?? null,
                'airtable_id' => $result['airtable_id'] ?? null,
                'error' => $result['error'] ?? null
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving record: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update status of a specific submission
     */
    public function updateStatus(Request $request, $submissionId)
    {
        try {
            $request->validate([
                'status' => 'required|string|in:PENDING,PRE_APPROVED,APPROVED,REJECTED,UNDER_REVIEW,RENEW',
                'admin_notes' => 'nullable|string|max:1000'
            ]);

            // Find the submission in the database
            $submission = \App\Models\BarangaySubmission::where('submission_id', $submissionId)->first();
            
            if (!$submission) {
                return response()->json([
                    'success' => false,
                    'message' => 'Submission not found'
                ], 404);
            }

            $user = auth()->user();
            $oldStatus = $submission->status;

            // Update the submission using the model methods (which handle both DB and Airtable sync)
            switch ($request->status) {
                case 'APPROVED':
                    $submission->approve($user, $request->admin_notes);
                    break;
                case 'REJECTED':
                    $submission->reject($user, 'Status changed via admin interface', $request->admin_notes);
                    break;
                case 'PRE_APPROVED':
                    $submission->preApprove($user, $request->admin_notes);
                    break;
                case 'UNDER_REVIEW':
                    $submission->markUnderReview($user, $request->admin_notes);
                    break;
                case 'RENEW':
                    $submission->markMoaExpired();
                    break;
                case 'PENDING':
                    // For PENDING, we need to manually update since there's no specific method
                    $submission->update([
                        'status' => 'PENDING',
                        'admin_notes' => $request->admin_notes
                    ]);
                    // Trigger sync manually
                    $submission->syncToAirtable();
                    break;
            }

            return response()->json([
                'success' => true,
                'message' => 'Status updated successfully',
                'data' => [
                    'submission_id' => $submission->submission_id,
                    'old_status' => $oldStatus,
                    'new_status' => $submission->status,
                    'admin_notes' => $submission->admin_notes
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get barangay submissions from database for display
     */
    public function getSubmissions(Request $request)
    {
        try {
            $submissions = BarangaySubmission::with(['approvedBy', 'reviewedBy'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($submission) {
                    return [
                        'id' => $submission->id,
                        'submission_id' => $submission->submission_id,
                        'barangay_name' => $submission->barangay_name,
                        'municipality_name' => $submission->municipality_name,
                        'province_name' => $submission->province_name,
                        'region_name' => $submission->region_name,
                        'status' => $submission->status,
                        'tier' => $submission->tier,
                        'stage' => $submission->stage,
                        'approved_by' => $submission->approvedBy?->name,
                        'approved_at' => $submission->approved_at?->format('Y-m-d'),
                        'reviewed_by' => $submission->reviewedBy?->name,
                        'reviewed_at' => $submission->reviewed_at?->format('Y-m-d'),
                        'admin_notes' => $submission->admin_notes,
                        'created_at' => $submission->created_at->format('Y-m-d H:i:s'),
                        'updated_at' => $submission->updated_at->format('Y-m-d H:i:s'),
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $submissions
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving submissions: ' . $e->getMessage()
            ], 500);
        }
    }
}
