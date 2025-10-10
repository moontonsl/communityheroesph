<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Airtable Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains the configuration for Airtable integration.
    | You can get your API key and Base ID from your Airtable account.
    |
    */

    /*
    |--------------------------------------------------------------------------
    | API Key
    |--------------------------------------------------------------------------
    |
    | Your Airtable API key. You can find this in your Airtable account
    | under Account > API documentation.
    |
    */

    'api_key' => env('AIRTABLE_API_KEY'),

    /*
    |--------------------------------------------------------------------------
    | Base ID
    |--------------------------------------------------------------------------
    |
    | Your Airtable Base ID. You can find this in your Airtable base URL
    | or in the API documentation for your base.
    |
    */

    'base_id' => env('AIRTABLE_BASE_ID'),

    /*
    |--------------------------------------------------------------------------
    | Table Names
    |--------------------------------------------------------------------------
    |
    | The names of your Airtable tables. These should match exactly
    | with your Airtable base table names.
    |
    */

    'tables' => [
        'barangay_submissions' => 'Barangay Submissions',
        'events' => 'Events',
        'event_reports' => 'Event Reports',
        'users' => 'Users',
    ],

    /*
    |--------------------------------------------------------------------------
    | Sync Settings
    |--------------------------------------------------------------------------
    |
    | Configuration for automatic syncing behavior.
    |
    */

    'sync' => [
        'enabled' => env('AIRTABLE_SYNC_ENABLED', true),
        'queue' => env('AIRTABLE_SYNC_QUEUE', 'default'),
        'retry_attempts' => env('AIRTABLE_SYNC_RETRY_ATTEMPTS', 3),
        'retry_delay' => env('AIRTABLE_SYNC_RETRY_DELAY', 60), // seconds
    ],

    /*
    |--------------------------------------------------------------------------
    | Field Mapping
    |--------------------------------------------------------------------------
    |
    | Map Laravel model fields to Airtable field names.
    | This helps maintain consistency between your database and Airtable.
    |
    */

    'field_mapping' => [
        'barangay_submissions' => [
            'submission_id' => 'Submission ID',
            'barangay_name' => 'Barangay Name',
            'municipality_name' => 'Municipality',
            'province_name' => 'Province',
            'region_name' => 'Region',
            'zip_code' => 'Zip Code',
            'population' => 'Population',
            'second_party_name' => 'Second Party Name',
            'position' => 'Position',
            'date_signed' => 'Date Signed',
            'stage' => 'Stage',
            'status' => 'Status',
            'tier' => 'Tier',
            'successful_events_count' => 'Successful Events Count',
            'moa_file_name' => 'MOA File Name',
            'moa_expiry_date' => 'MOA Expiry Date',
            'is_moa_expired' => 'Is MOA Expired',
            'rejection_reason' => 'Rejection Reason',
            'admin_notes' => 'Admin Notes',
            'approved_by' => 'Approved By',
            'approved_at' => 'Approved At',
            'reviewed_by' => 'Reviewed By',
            'reviewed_at' => 'Reviewed At',
            'created_at' => 'Created At',
            'updated_at' => 'Updated At',
        ],
        'events' => [
            'event_id' => 'Event ID',
            'event_name' => 'Event Name',
            'event_description' => 'Event Description',
            'event_date' => 'Event Date',
            'event_start_time' => 'Event Start Time',
            'event_end_time' => 'Event End Time',
            'event_location' => 'Event Location',
            'campaign' => 'Campaign',
            'expected_participants' => 'Expected Participants',
            'event_type' => 'Event Type',
            'contact_person' => 'Contact Person',
            'contact_number' => 'Contact Number',
            'contact_email' => 'Contact Email',
            'requirements' => 'Requirements',
            'status' => 'Status',
            'is_successful' => 'Is Successful',
            'proposal_file_name' => 'Proposal File Name',
            'moa_file_name' => 'MOA File Name',
            'rejection_reason' => 'Rejection Reason',
            'admin_notes' => 'Admin Notes',
            'applied_by' => 'Applied By',
            'approved_by' => 'Approved By',
            'approved_at' => 'Approved At',
            'reviewed_by' => 'Reviewed By',
            'reviewed_at' => 'Reviewed At',
            'completed_at' => 'Completed At',
            'created_at' => 'Created At',
            'updated_at' => 'Updated At',
        ],
        'event_reports' => [
            'report_id' => 'Report ID',
            'event_name' => 'Event Name',
            'event_description' => 'Event Description',
            'event_date' => 'Event Date',
            'event_location' => 'Event Location',
            'campaign' => 'Campaign',
            'pic' => 'PIC',
            'cash_allocation' => 'Cash Allocation',
            'diamonds_expenditure' => 'Diamonds Expenditure',
            'total_cost_php' => 'Total Cost PHP',
            'status' => 'Status',
            'first_clearance_status' => 'First Clearance Status',
            'final_clearance_status' => 'Final Clearance Status',
            'post_event_file_name' => 'Post Event File Name',
            'admin_notes' => 'Admin Notes',
            'reported_by' => 'Reported By',
            'reviewed_by' => 'Reviewed By',
            'reviewed_at' => 'Reviewed At',
            'approved_by' => 'Approved By',
            'approved_at' => 'Approved At',
            'first_cleared_by' => 'First Cleared By',
            'first_cleared_at' => 'First Cleared At',
            'final_cleared_by' => 'Final Cleared By',
            'final_cleared_at' => 'Final Cleared At',
            'created_at' => 'Created At',
            'updated_at' => 'Updated At',
        ],
    ],

];
