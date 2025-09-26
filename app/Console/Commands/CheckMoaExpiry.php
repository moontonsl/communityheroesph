<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\BarangaySubmission;

class CheckMoaExpiry extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'moa:check-expiry';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for expired MOAs and set status to RENEW';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for expired MOAs...');
        
        // Find approved submissions with expired MOAs that are not already marked as expired
        $expiredSubmissions = BarangaySubmission::where('status', 'APPROVED')
            ->where('is_moa_expired', false)
            ->whereNotNull('moa_expiry_date')
            ->where('moa_expiry_date', '<', now())
            ->get();
        
        $count = 0;
        
        foreach ($expiredSubmissions as $submission) {
            $submission->markMoaExpired();
            $count++;
            
            $this->line("Marked MOA as expired for submission: {$submission->submission_id} - {$submission->barangay_name}");
        }
        
        if ($count > 0) {
            $this->info("Successfully marked {$count} MOAs as expired and set status to RENEW.");
        } else {
            $this->info('No expired MOAs found.');
        }
        
        return Command::SUCCESS;
    }
}
