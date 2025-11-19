<?php

namespace App\Services;

use App\Models\BarangaySubmission;
use App\Models\Event;
use App\Models\EventReporting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Config;

class AirtableService
{
    private string $baseId;
    private string $apiKey;
    private string $baseUrl;

    public function __construct()
    {
        $this->baseId = config('airtable.base_id');
        $this->apiKey = config('airtable.api_key');
        $this->baseUrl = "https://api.airtable.com/v0/{$this->baseId}";
    }

    /**
     * Sync barangay submission to Airtable
     * Updates existing record if found, otherwise creates new one
     */
    public function syncBarangaySubmission(BarangaySubmission $submission): array
    {
        try {
            $airtableData = $this->formatBarangaySubmissionForAirtable($submission);
            
            // Check if record already exists in Airtable
            $recordId = $this->getBarangaySubmissionRecordIdBySubmissionId($submission->submission_id);
            
            // Debug: Log the data being sent
            Log::info('Sending barangay submission to Airtable', [
                'submission_id' => $submission->submission_id,
                'existing_record_id' => $recordId,
                'action' => $recordId ? 'update' : 'create',
                'airtable_data' => $airtableData
            ]);
            
            if ($recordId) {
                // Update existing record
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Content-Type' => 'application/json',
                ])->patch($this->baseUrl . '/Barangay%20Submissions/' . $recordId, [
                    'fields' => $airtableData
                ]);
            } else {
                // Create new record
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Content-Type' => 'application/json',
                ])->post($this->baseUrl . '/Barangay%20Submissions', [
                    'fields' => $airtableData
                ]);
            }

            if ($response->successful()) {
                $result = $response->json();
                Log::info('Barangay submission synced to Airtable', [
                    'submission_id' => $submission->submission_id,
                    'airtable_id' => $result['id'] ?? $recordId,
                    'action' => $recordId ? 'updated' : 'created'
                ]);
                
                return [
                    'success' => true,
                    'airtable_id' => $result['id'] ?? $recordId,
                    'data' => $result
                ];
            } else {
                Log::error('Failed to sync barangay submission to Airtable', [
                    'submission_id' => $submission->submission_id,
                    'status' => $response->status(),
                    'response' => $response->body()
                ]);
                
                return [
                    'success' => false,
                    'error' => 'Airtable API error: ' . $response->status(),
                    'response' => $response->body()
                ];
            }
        } catch (\Exception $e) {
            Log::error('Exception syncing barangay submission to Airtable', [
                'submission_id' => $submission->submission_id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Sync event to Airtable
     * Updates existing record if found, otherwise creates new one
     */
    public function syncEvent(Event $event, string $action = 'create'): array
    {
        try {
            $airtableData = $this->formatEventForAirtable($event);

            // Link to Barangay Submissions via Brgy ID (link field) using our Submission ID
            if ($event->barangaySubmission?->submission_id) {
                $linkedId = $this->getBarangaySubmissionRecordIdBySubmissionId($event->barangaySubmission->submission_id);
                if ($linkedId) {
                    $airtableData['Brgy ID'] = [$linkedId];
                }
            }

            // Always check if record exists first (regardless of action parameter)
            // This prevents duplicates and ensures we update existing records
            $recordId = $this->getEventRecordIdByEventId($event->event_id);
            
            // Debug: Log the data being sent
            Log::info('Sending event to Airtable', [
                'event_id' => $event->event_id,
                'existing_record_id' => $recordId,
                'action' => $recordId ? 'update' : 'create',
                'airtable_data' => $airtableData
            ]);

            if ($recordId) {
                // Update existing record
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Content-Type' => 'application/json',
                ])->patch($this->baseUrl . '/Events/' . $recordId, [
                    'fields' => $airtableData
                ]);
            } else {
                // Create new record
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Content-Type' => 'application/json',
                ])->post($this->baseUrl . '/Events', [
                    'fields' => $airtableData
                ]);
            }

            if ($response->successful()) {
                $result = $response->json();
                Log::info('Event synced to Airtable', [
                    'event_id' => $event->event_id,
                    'airtable_id' => $result['id'] ?? $recordId,
                    'action' => $recordId ? 'updated' : 'created'
                ]);
                
                return [
                    'success' => true,
                    'airtable_id' => $result['id'] ?? null,
                    'data' => $result
                ];
            } else {
                Log::error('Failed to sync event to Airtable', [
                    'event_id' => $event->event_id,
                    'status' => $response->status(),
                    'response' => $response->body()
                ]);
                
                return [
                    'success' => false,
                    'error' => 'Airtable API error: ' . $response->status(),
                    'response' => $response->body()
                ];
            }
        } catch (\Exception $e) {
            Log::error('Exception syncing event to Airtable', [
                'event_id' => $event->event_id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Resolve Airtable record ID in "Events" by our Event ID.
     */
    private function getEventRecordIdByEventId(string $eventId): ?string
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
            ])->get($this->baseUrl . '/Events', [
                'maxRecords' => 1,
                'filterByFormula' => sprintf('( {Event ID} = "%s" )', $eventId),
            ]);

            if (!$response->successful()) {
                Log::warning('Airtable lookup failed for event', [
                    'event_id' => $eventId,
                    'status' => $response->status(),
                    'response' => $response->body()
                ]);
                return null;
            }

            $data = $response->json();
            $records = $data['records'] ?? [];
            return $records[0]['id'] ?? null;
        } catch (\Exception $e) {
            Log::warning('Airtable lookup exception (event)', [
                'event_id' => $eventId,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Resolve Airtable record ID in "Barangay Submissions" by our Submission ID.
     */
    private function getBarangaySubmissionRecordIdBySubmissionId(string $submissionId): ?string
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
            ])->get($this->baseUrl . '/Barangay%20Submissions', [
                'maxRecords' => 1,
                'filterByFormula' => sprintf('( {Submission ID} = "%s" )', $submissionId),
            ]);

            if (!$response->successful()) {
                Log::warning('Airtable lookup failed for submission', [
                    'submission_id' => $submissionId,
                    'status' => $response->status(),
                    'response' => $response->body()
                ]);
                return null;
            }

            $data = $response->json();
            $records = $data['records'] ?? [];
            return $records[0]['id'] ?? null;
        } catch (\Exception $e) {
            Log::warning('Airtable lookup exception', [
                'submission_id' => $submissionId,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Sync event reporting to Airtable
     */
    public function syncEventReporting(EventReporting $reporting): array
    {
        try {
            $airtableData = $this->formatEventReportingForAirtable($reporting);
            
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/Event%20Reports', [
                'fields' => $airtableData
            ]);

            if ($response->successful()) {
                $result = $response->json();
                Log::info('Event reporting synced to Airtable', [
                    'report_id' => $reporting->report_id,
                    'airtable_id' => $result['id'] ?? null
                ]);
                
                return [
                    'success' => true,
                    'airtable_id' => $result['id'] ?? null,
                    'data' => $result
                ];
            } else {
                Log::error('Failed to sync event reporting to Airtable', [
                    'report_id' => $reporting->report_id,
                    'status' => $response->status(),
                    'response' => $response->body()
                ]);
                
                return [
                    'success' => false,
                    'error' => 'Airtable API error: ' . $response->status(),
                    'response' => $response->body()
                ];
            }
        } catch (\Exception $e) {
            Log::error('Exception syncing event reporting to Airtable', [
                'report_id' => $reporting->report_id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Delete a Barangay Submission in Airtable by our Submission ID
     */
    public function deleteBarangaySubmissionBySubmissionId(string $submissionId): array
    {
        try {
            if (empty($submissionId)) {
                return [
                    'success' => false,
                    'error' => 'Missing submission id',
                ];
            }

            $recordId = $this->getBarangaySubmissionRecordIdBySubmissionId($submissionId);
            if (!$recordId) {
                Log::info('No Airtable record found to delete for barangay submission', [
                    'submission_id' => $submissionId,
                ]);
                // Treat as success (already deleted/not present)
                return ['success' => true];
            }

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
            ])->delete($this->baseUrl . '/Barangay%20Submissions/' . $recordId);

            if ($response->successful()) {
                Log::info('Deleted barangay submission in Airtable', [
                    'submission_id' => $submissionId,
                    'airtable_record_id' => $recordId,
                ]);
                return ['success' => true];
            }

            Log::error('Failed to delete barangay submission in Airtable', [
                'submission_id' => $submissionId,
                'airtable_record_id' => $recordId,
                'status' => $response->status(),
                'response' => $response->body(),
            ]);
            return [
                'success' => false,
                'error' => 'Airtable API error: ' . $response->status(),
                'response' => $response->body(),
            ];
        } catch (\Exception $e) {
            Log::error('Exception deleting barangay submission in Airtable', [
                'submission_id' => $submissionId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Delete an Event in Airtable by our Event ID
     */
    public function deleteEventByEventId(string $eventId): array
    {
        try {
            if (empty($eventId)) {
                return [
                    'success' => false,
                    'error' => 'Missing event id',
                ];
            }

            $recordId = $this->getEventRecordIdByEventId($eventId);
            if (!$recordId) {
                Log::info('No Airtable record found to delete for event', [
                    'event_id' => $eventId,
                ]);
                // Treat as success (already deleted/not present)
                return ['success' => true];
            }

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
            ])->delete($this->baseUrl . '/Events/' . $recordId);

            if ($response->successful()) {
                Log::info('Deleted event in Airtable', [
                    'event_id' => $eventId,
                    'airtable_record_id' => $recordId,
                ]);
                return ['success' => true];
            }

            Log::error('Failed to delete event in Airtable', [
                'event_id' => $eventId,
                'airtable_record_id' => $recordId,
                'status' => $response->status(),
                'response' => $response->body(),
            ]);
            return [
                'success' => false,
                'error' => 'Airtable API error: ' . $response->status(),
                'response' => $response->body(),
            ];
        } catch (\Exception $e) {
            Log::error('Exception deleting event in Airtable', [
                'event_id' => $eventId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Format barangay submission data for Airtable
     */
    private function formatBarangaySubmissionForAirtable(BarangaySubmission $submission): array
    {
        return [
            'Submission ID' => $submission->submission_id,
            'Barangay Name' => $submission->barangay_name,
            'Municipality' => $submission->municipality_name,
            'Province' => $submission->province_name,
            'Region' => $submission->region_name,
            'Zip Code' => $submission->zip_code,
            'Population' => $submission->population ? (string) $submission->population : null,
            'Second Party Name' => $submission->second_party_name,
            'Position' => $submission->position,
            'Date Signed' => $submission->date_signed?->format('Y-m-d'),
            'Stage' => $submission->stage,
            'Status' => $submission->status,
            'Tier' => $submission->tier,
            'Successful Events Count' => $submission->successful_events_count ? (string) $submission->successful_events_count : null,
            'MOA File Name' => $submission->moa_file_name,
            'MOA Expiry Date' => $submission->moa_expiry_date?->format('Y-m-d'),
            'Is MOA Expired' => $submission->is_moa_expired,
            'Rejection Reason' => $submission->rejection_reason,
            'Admin Notes' => $submission->admin_notes,
            'Approved By' => $submission->approvedBy?->name,
            'Approved At' => $submission->approved_at?->format('Y-m-d'),
            'Reviewed By' => $submission->reviewedBy?->name,
            'Reviewed At' => $submission->reviewed_at?->format('Y-m-d'),
            'Created At' => $submission->created_at->format('Y-m-d'),
            'Updated At' => $submission->updated_at->format('Y-m-d'),
        ];
    }

    /**
     * Format event data for Airtable
     */
    private function formatEventForAirtable(Event $event): array
    {
        // Only include fields that exist in your Airtable "Events" table to avoid 422 errors
        return [
            // Identifiers
            'Event ID' => $event->event_id,

            // Core event info
            'Event Name' => $event->event_name,
            'Description' => $event->event_description,
            'Campaign' => $event->campaign,
            'Event Date' => $event->event_date?->format('Y-m-d'),
            'Event Start Time' => $event->event_start_time?->format('H:i'),
            'Event End Time' => $event->event_end_time?->format('H:i'),
            'Event Type' => $event->event_type,
            'Location' => $event->event_location,
            'Expected Participants' => $event->expected_participants,

            // Contact & requirements
            'Contact Person' => $event->contact_person,
            'Contact Number' => $event->contact_number,
            'Contact Email' => $event->contact_email,
            'Requirements' => $event->requirements,

            // Status / outcomes
            'Status' => $event->status,
            'Is Successful' => $event->is_successful,
            'Completed At' => $event->completed_at?->format('Y-m-d'),

            // Files (names only)
            'Proposal File Name' => $event->proposal_file_name,
            'MOA File Name' => $event->moa_file_name,

            // Admin / review
            'Rejection Reason' => $event->rejection_reason,
            'Admin Notes' => $event->admin_notes,
            'Applied By' => $event->appliedBy?->name,
            'Approved By' => $event->approvedBy?->name,
            'Approved At' => $event->approved_at?->format('Y-m-d'),
            'Reviewed By' => $event->reviewedBy?->name,
            'Reviewed At' => $event->reviewed_at?->format('Y-m-d'),

            // Related barangay info for convenience
            'Barangay Name' => $event->barangaySubmission?->barangay_name,
            'Municipality' => $event->barangaySubmission?->municipality_name,
            'Province' => $event->barangaySubmission?->province_name,
            'Region' => $event->barangaySubmission?->region_name,

            // Timestamps
            'Created At' => $event->created_at?->format('Y-m-d'),
            'Updated At' => $event->updated_at?->format('Y-m-d'),
        ];
    }

    /**
     * Format event reporting data for Airtable
     */
    private function formatEventReportingForAirtable(EventReporting $reporting): array
    {
        return [
            'Report ID' => $reporting->report_id,
            'Event Name' => $reporting->event_name,
            'Event Description' => $reporting->event_description,
            'Event Date' => $reporting->event_date?->format('Y-m-d'),
            'Event Location' => $reporting->event_location,
            'Campaign' => $reporting->campaign,
            'PIC' => $reporting->pic,
            'Cash Allocation' => $reporting->cash_allocation,
            'Diamonds Expenditure' => $reporting->diamonds_expenditure,
            'Total Cost PHP' => $reporting->total_cost_php,
            'Status' => $reporting->status,
            'First Clearance Status' => $reporting->first_clearance_status,
            'Final Clearance Status' => $reporting->final_clearance_status,
            'Post Event File Name' => $reporting->post_event_file_name,
            'Admin Notes' => $reporting->admin_notes,
            'Reported By' => $reporting->reportedBy?->name,
            'Reviewed By' => $reporting->reviewedBy?->name,
            'Reviewed At' => $reporting->reviewed_at?->format('Y-m-d'),
            'Approved By' => $reporting->approvedBy?->name,
            'Approved At' => $reporting->approved_at?->format('Y-m-d'),
            'First Cleared By' => $reporting->firstClearedBy?->name,
            'First Cleared At' => $reporting->first_cleared_at?->format('Y-m-d'),
            'Final Cleared By' => $reporting->finalClearedBy?->name,
            'Final Cleared At' => $reporting->final_cleared_at?->format('Y-m-d'),
            'Created At' => $reporting->created_at->format('Y-m-d'),
            'Updated At' => $reporting->updated_at->format('Y-m-d'),
        ];
    }

    /**
     * Test Airtable connection
     */
    public function testConnection(): array
    {
        try {
            // Debug: Log the API key (first 10 characters only for security)
            Log::info('Testing Airtable connection', [
                'base_id' => $this->baseId,
                'api_key_prefix' => substr($this->apiKey, 0, 10) . '...',
                'api_key_length' => strlen($this->apiKey)
            ]);

            // Test connection by trying to list records from a table (this works with data.records:read)
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
            ])->get("https://api.airtable.com/v0/{$this->baseId}/Barangay%20Submissions?maxRecords=1");

            // Debug: Log the response
            Log::info('Airtable API response', [
                'status' => $response->status(),
                'headers' => $response->headers(),
                'body' => $response->body()
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'success' => true,
                    'message' => 'Airtable connection successful',
                    'base_name' => 'Communityheroes',
                    'table_accessible' => true,
                    'records_count' => count($data['records'] ?? [])
                ];
            } else {
                return [
                    'success' => false,
                    'error' => 'Airtable API error: ' . $response->status(),
                    'response' => $response->body()
                ];
            }
        } catch (\Exception $e) {
            Log::error('Airtable connection exception', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
}
