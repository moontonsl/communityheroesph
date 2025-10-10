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
     */
    public function syncBarangaySubmission(BarangaySubmission $submission): array
    {
        try {
            $airtableData = $this->formatBarangaySubmissionForAirtable($submission);
            
            // Debug: Log the data being sent
            Log::info('Sending barangay submission to Airtable', [
                'submission_id' => $submission->submission_id,
                'airtable_data' => $airtableData
            ]);
            
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/Barangay%20Submissions', [
                'fields' => $airtableData
            ]);

            if ($response->successful()) {
                $result = $response->json();
                Log::info('Barangay submission synced to Airtable', [
                    'submission_id' => $submission->submission_id,
                    'airtable_id' => $result['id'] ?? null
                ]);
                
                return [
                    'success' => true,
                    'airtable_id' => $result['id'] ?? null,
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
     */
    public function syncEvent(Event $event): array
    {
        try {
            $airtableData = $this->formatEventForAirtable($event);
            
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/Events', [
                'fields' => $airtableData
            ]);

            if ($response->successful()) {
                $result = $response->json();
                Log::info('Event synced to Airtable', [
                    'event_id' => $event->event_id,
                    'airtable_id' => $result['id'] ?? null
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
        return [
            'Event ID' => $event->event_id,
            'Event Name' => $event->event_name,
            'Event Description' => $event->event_description,
            'Event Date' => $event->event_date?->format('Y-m-d'),
            'Event Start Time' => $event->event_start_time?->format('H:i'),
            'Event End Time' => $event->event_end_time?->format('H:i'),
            'Event Location' => $event->event_location,
            'Campaign' => $event->campaign,
            'Expected Participants' => $event->expected_participants,
            'Event Type' => $event->event_type,
            'Contact Person' => $event->contact_person,
            'Contact Number' => $event->contact_number,
            'Contact Email' => $event->contact_email,
            'Requirements' => $event->requirements,
            'Status' => $event->status,
            'Is Successful' => $event->is_successful,
            'Proposal File Name' => $event->proposal_file_name,
            'MOA File Name' => $event->moa_file_name,
            'Rejection Reason' => $event->rejection_reason,
            'Admin Notes' => $event->admin_notes,
            'Applied By' => $event->appliedBy?->name,
            'Approved By' => $event->approvedBy?->name,
            'Approved At' => $event->approved_at?->format('Y-m-d'),
            'Reviewed By' => $event->reviewedBy?->name,
            'Reviewed At' => $event->reviewed_at?->format('Y-m-d'),
            'Completed At' => $event->completed_at?->format('Y-m-d'),
            'Created At' => $event->created_at->format('Y-m-d'),
            'Updated At' => $event->updated_at->format('Y-m-d'),
            // Related barangay data
            'Barangay Name' => $event->barangaySubmission?->barangay_name,
            'Municipality' => $event->barangaySubmission?->municipality_name,
            'Province' => $event->barangaySubmission?->province_name,
            'Region' => $event->barangaySubmission?->region_name,
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
