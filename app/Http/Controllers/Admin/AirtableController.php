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
}
