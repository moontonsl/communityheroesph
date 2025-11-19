<?php

namespace App\Console\Commands;

use App\Services\AirtableService;
use Illuminate\Console\Command;

class TestAirtableConnection extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'airtable:test';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test Airtable connection and configuration';

    /**
     * Execute the console command.
     */
    public function handle(AirtableService $airtableService)
    {
        $this->info('Testing Airtable connection...');
        
        // Check configuration
        $this->info('Configuration:');
        $this->line('  Base ID: ' . (config('airtable.base_id') ? '✓ Set' : '✗ Missing'));
        $this->line('  API Key: ' . (config('airtable.api_key') ? '✓ Set' : '✗ Missing'));
        $this->line('  Sync Enabled: ' . (config('airtable.sync.enabled') ? '✓ Yes' : '✗ No'));
        
        if (!config('airtable.base_id') || !config('airtable.api_key')) {
            $this->error('Airtable configuration is incomplete. Please set AIRTABLE_BASE_ID and AIRTABLE_API_KEY in your .env file.');
            return 1;
        }
        
        // Test connection
        $this->info('Testing API connection...');
        $result = $airtableService->testConnection();
        
        if ($result['success']) {
            $this->info('✓ Airtable connection successful!');
            $this->line('  Base Name: ' . ($result['base_name'] ?? 'Unknown'));
        } else {
            $this->error('✗ Airtable connection failed:');
            $this->line('  Error: ' . $result['error']);
            return 1;
        }
        
        $this->info('Airtable integration is ready to use!');
        return 0;
    }
}











