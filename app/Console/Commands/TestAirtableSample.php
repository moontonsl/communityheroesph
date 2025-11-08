<?php

namespace App\Console\Commands;

use App\Services\AirtableService;
use Illuminate\Console\Command;

class TestAirtableSample extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'airtable:sample {submission_id=CH-OHRYV017}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test Airtable sample functions - get and update a record';

    /**
     * Execute the console command.
     */
    public function handle(AirtableService $airtableService)
    {
        $submissionId = $this->argument('submission_id');
        
        $this->info("=== AIRTABLE SAMPLE FUNCTIONS DEMO ===");
        $this->line("");
        
        $this->info("1. Getting record for Submission ID: {$submissionId}");
        $this->line("----------------------------------------");
        
        $recordResult = $airtableService->getRecordBySubmissionId($submissionId);
        
        if ($recordResult['success']) {
            $record = $recordResult['data'];
            $airtableId = $recordResult['airtable_id'];
            
            $this->info("✅ Record found!");
            $this->line("Airtable ID: {$airtableId}");
            $this->line("Barangay Name: " . ($record['fields']['Barangay Name'] ?? 'N/A'));
            $this->line("Municipality: " . ($record['fields']['Municipality'] ?? 'N/A'));
            $this->line("Province: " . ($record['fields']['Province'] ?? 'N/A'));
            $this->line("Current Status: " . ($record['fields']['Status'] ?? 'N/A'));
            $this->line("Current Admin Notes: " . ($record['fields']['Admin Notes'] ?? 'None'));
            $this->line("");
            
            if ($this->confirm('Do you want to update the status to APPROVED?')) {
                $this->info("2. Updating status to 'APPROVED'");
                $this->line("----------------------------------------");
                
                $updateResult = $airtableService->updateSubmissionStatus(
                    $submissionId,
                    'APPROVED',
                    'Sample update: Status changed to APPROVED via API test - ' . now()->format('Y-m-d H:i:s')
                );
                
                if ($updateResult['success']) {
                    $this->info("✅ Status updated successfully!");
                    $this->line("");
                    
                    $this->info("3. Verifying the update");
                    $this->line("----------------------------------------");
                    
                    $verifyResult = $airtableService->getRecordBySubmissionId($submissionId);
                    if ($verifyResult['success']) {
                        $updatedRecord = $verifyResult['data'];
                        $this->info("✅ Verification successful!");
                        $this->line("New Status: " . ($updatedRecord['fields']['Status'] ?? 'N/A'));
                        $this->line("Approved By: " . ($updatedRecord['fields']['Approved By'] ?? 'N/A'));
                        $this->line("Approved At: " . ($updatedRecord['fields']['Approved At'] ?? 'N/A'));
                        $this->line("Updated At: " . ($updatedRecord['fields']['Updated At'] ?? 'N/A'));
                        $this->line("Admin Notes: " . ($updatedRecord['fields']['Admin Notes'] ?? 'None'));
                    } else {
                        $this->error("❌ Failed to verify update: " . $verifyResult['error']);
                    }
                    
                } else {
                    $this->error("❌ Failed to update status: " . $updateResult['error']);
                }
            }
            
        } else {
            $this->error("❌ Record not found: " . $recordResult['error']);
            $this->line("");
            $this->info("Available submission IDs in your Airtable:");
            $this->line("- CH-OHRYV017");
            $this->line("- CH-LFCSMMZH");
            $this->line("- CH-GV9UIJC7");
            $this->line("- CH-E8BC7DB8");
            $this->line("- CH-TN6YAMPF");
            $this->line("- CH-BFLQS58Y");
            $this->line("- CH-Y7GXYKRL");
            $this->line("- CH-FKFLM71N");
        }
        
        $this->line("");
        $this->info("=== DEMO COMPLETED ===");
        
        return 0;
    }
}







