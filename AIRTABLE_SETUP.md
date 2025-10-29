# Airtable Integration Setup Guide

## Overview
Your Community Heroes PH application now automatically syncs data to Airtable when users submit barangay registrations and event applications. This guide will help you set up the integration.

## Prerequisites
1. An Airtable account
2. A base in Airtable with the following tables:
   - **Barangay Submissions**
   - **Events** 
   - **Event Reports**

## Step 1: Create Your Airtable Base

### Create Tables
Create these tables in your Airtable base with the following fields:

#### Barangay Submissions Table
- Submission ID (Single line text)
- Barangay Name (Single line text)
- Municipality (Single line text)
- Province (Single line text)
- Region (Single line text)
- Zip Code (Single line text)
- Population (Number)
- Second Party Name (Single line text)
- Position (Single line text)
- Date Signed (Date)
- Stage (Single select: NEW, RENEWAL)
- Status (Single select: PENDING, PRE_APPROVED, APPROVED, REJECTED, UNDER_REVIEW, RENEW)
- Tier (Single select: BRONZE, SILVER, GOLD, PLATINUM)
- Successful Events Count (Number)
- MOA File Name (Single line text)
- MOA Expiry Date (Date)
- Is MOA Expired (Checkbox)
- Rejection Reason (Long text)
- Admin Notes (Long text)
- Approved By (Single line text)
- Approved At (Date)
- Reviewed By (Single line text)
- Reviewed At (Date)
- Created At (Date)
- Updated At (Date)

#### Events Table
- Event ID (Single line text)
- Event Name (Single line text)
- Event Description (Long text)
- Event Date (Date)
- Event Start Time (Single line text)
- Event End Time (Single line text)
- Event Location (Single line text)
- Campaign (Single line text)
- Expected Participants (Number)
- Event Type (Single line text)
- Contact Person (Single line text)
- Contact Number (Single line text)
- Contact Email (Email)
- Requirements (Long text)
- Status (Single select: PENDING, PRE_APPROVED, APPROVED, REJECTED, COMPLETED, CANCELLED, CLEARED)
- Is Successful (Checkbox)
- Proposal File Name (Single line text)
- MOA File Name (Single line text)
- Rejection Reason (Long text)
- Admin Notes (Long text)
- Applied By (Single line text)
- Approved By (Single line text)
- Approved At (Date)
- Reviewed By (Single line text)
- Reviewed At (Date)
- Completed At (Date)
- Created At (Date)
- Updated At (Date)
- Barangay Name (Single line text)
- Municipality (Single line text)
- Province (Single line text)
- Region (Single line text)

#### Event Reports Table
- Report ID (Single line text)
- Event Name (Single line text)
- Event Description (Long text)
- Event Date (Date)
- Event Location (Single line text)
- Campaign (Single line text)
- PIC (Single line text)
- Cash Allocation (Currency)
- Diamonds Expenditure (Number)
- Total Cost PHP (Currency)
- Status (Single select: DRAFT, SUBMITTED, REVIEWED, APPROVED, FIRST_CLEARED, FINAL_CLEARED)
- First Clearance Status (Single line text)
- Final Clearance Status (Single line text)
- Post Event File Name (Single line text)
- Admin Notes (Long text)
- Reported By (Single line text)
- Reviewed By (Single line text)
- Reviewed At (Date)
- Approved By (Single line text)
- Approved At (Date)
- First Cleared By (Single line text)
- First Cleared At (Date)
- Final Cleared By (Single line text)
- Final Cleared At (Date)
- Created At (Date)
- Updated At (Date)

## Step 2: Get Your API Credentials

1. Go to [Airtable API Documentation](https://airtable.com/api)
2. Select your base
3. Copy your **Base ID** (starts with `app...`)
4. Go to [Account Settings](https://airtable.com/account) → API
5. Generate a new **Personal Access Token** (starts with `pat...`)

## Step 3: Configure Your Laravel Application

Add these environment variables to your `.env` file:

```env
# Airtable Configuration
AIRTABLE_API_KEY=pat_your_personal_access_token_here
AIRTABLE_BASE_ID=app_your_base_id_here
AIRTABLE_SYNC_ENABLED=true
AIRTABLE_SYNC_QUEUE=default
AIRTABLE_SYNC_RETRY_ATTEMPTS=3
AIRTABLE_SYNC_RETRY_DELAY=60
```

## Step 4: Test the Integration

### Option 1: Using the Admin Interface
1. Log in as a Super Admin
2. Go to `/admin/airtable` in your browser
3. Click "Test Connection" to verify your setup
4. Click "Sync All Data" to sync existing data

### Option 2: Using Artisan Command
```bash
php artisan airtable:test
```

## Step 5: Verify Automatic Sync

1. Submit a new barangay registration through the form
2. Check your Airtable base - the data should appear automatically
3. Check the Laravel logs for sync status:
   ```bash
   tail -f storage/logs/laravel.log
   ```

## How It Works

### Automatic Sync
- When a user submits a barangay registration, the data is automatically queued for Airtable sync
- When a user submits an event application, the data is automatically queued for Airtable sync
- The sync happens in the background using Laravel queues

### Manual Sync
- Super Admins can manually sync individual records or all data
- Use the admin interface at `/admin/airtable`
- Or use the API endpoints directly

### Error Handling
- If Airtable sync fails, it won't affect the main application
- Failed syncs are logged and can be retried
- The system will retry failed syncs up to 3 times with increasing delays

## Troubleshooting

### Common Issues

1. **"Connection failed" error**
   - Check your API key and Base ID
   - Ensure your Personal Access Token has the correct permissions
   - Verify the Base ID is correct

2. **"Table not found" error**
   - Ensure your table names match exactly: "Barangay Submissions", "Events", "Event Reports"
   - Check that the tables exist in your base

3. **"Field not found" error**
   - Ensure all required fields exist in your Airtable tables
   - Check field names match exactly (case-sensitive)

4. **Sync not working**
   - Check if `AIRTABLE_SYNC_ENABLED=true` in your `.env`
   - Ensure Laravel queues are running: `php artisan queue:work`
   - Check the logs: `tail -f storage/logs/laravel.log`

### Queue Management
Make sure your Laravel queues are running:
```bash
php artisan queue:work
```

Or use Supervisor for production:
```bash
sudo supervisorctl start laravel-worker:*
```

## API Endpoints

### Admin Endpoints (Super Admin only)
- `GET /admin/airtable` - Management interface
- `GET /admin/airtable/status` - Get sync status
- `POST /admin/airtable/test` - Test connection
- `POST /admin/airtable/sync-all` - Sync all data
- `POST /admin/airtable/sync-submission/{id}` - Sync specific submission
- `POST /admin/airtable/sync-event/{id}` - Sync specific event

## Security Notes

- Your Airtable API key should be kept secure
- Only Super Admins can access Airtable management features
- Sync operations are logged for audit purposes
- Failed syncs don't affect the main application functionality

## Support

If you encounter issues:
1. Check the Laravel logs: `storage/logs/laravel.log`
2. Test the connection using the admin interface
3. Verify your Airtable base structure matches the requirements
4. Ensure your API credentials are correct




