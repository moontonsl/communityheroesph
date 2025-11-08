<?php

namespace App\Jobs;

use App\Models\BarangaySubmission;
use App\Models\Event;
use App\Models\EventReporting;
use App\Services\AirtableService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SyncToAirtableJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $backoff = [60, 300, 900]; // 1 minute, 5 minutes, 15 minutes

    protected string $modelType;
    protected int $modelId;
    protected string $action;
    protected ?string $uniqueKey = null;

    /**
     * Create a new job instance.
     */
    public function __construct(string $modelType, int $modelId, string $action = 'create', ?string $uniqueKey = null)
    {
        $this->modelType = $modelType;
        $this->modelId = $modelId;
        $this->action = $action;
        $this->uniqueKey = $uniqueKey;
        
        // Set queue based on configuration
        $this->onQueue(config('airtable.sync.queue', 'default'));
    }

    /**
     * Execute the job.
     */
    public function handle(AirtableService $airtableService): void
    {
        try {
            Log::info('Starting Airtable sync job', [
                'model_type' => $this->modelType,
                'model_id' => $this->modelId,
                'action' => $this->action,
                'unique_key' => $this->uniqueKey,
                'attempt' => $this->attempts()
            ]);

            $model = $this->getModel();
            
            if (!$model && $this->action !== 'delete') {
                Log::warning('Model not found for Airtable sync', [
                    'model_type' => $this->modelType,
                    'model_id' => $this->modelId
                ]);
                return;
            }

            $result = $this->syncModel($airtableService, $model);

            if ($result['success']) {
                Log::info('Airtable sync completed successfully', [
                    'model_type' => $this->modelType,
                    'model_id' => $this->modelId,
                    'action' => $this->action,
                    'airtable_id' => $result['airtable_id'] ?? null
                ]);
            } else {
                Log::error('Airtable sync failed', [
                    'model_type' => $this->modelType,
                    'model_id' => $this->modelId,
                    'action' => $this->action,
                    'error' => $result['error'] ?? 'Unknown error'
                ]);
                
                // Re-throw exception to trigger retry
                throw new \Exception($result['error'] ?? 'Airtable sync failed');
            }

        } catch (\Exception $e) {
            Log::error('Exception in Airtable sync job', [
                'model_type' => $this->modelType,
                'model_id' => $this->modelId,
                'error' => $e->getMessage(),
                'attempt' => $this->attempts(),
                'max_attempts' => $this->tries
            ]);

            // If this is the last attempt, log the failure
            if ($this->attempts() >= $this->tries) {
                Log::error('Airtable sync job failed permanently', [
                    'model_type' => $this->modelType,
                    'model_id' => $this->modelId,
                    'final_error' => $e->getMessage()
                ]);
            }

            throw $e;
        }
    }

    /**
     * Get the model instance
     */
    private function getModel()
    {
        return match ($this->modelType) {
            'barangay_submission' => BarangaySubmission::find($this->modelId),
            'event' => Event::find($this->modelId),
            'event_reporting' => EventReporting::find($this->modelId),
            default => null,
        };
    }

    /**
     * Sync the model to Airtable
     */
    private function syncModel(AirtableService $airtableService, $model): array
    {
        return match ($this->modelType) {
            'barangay_submission' => $this->action === 'delete'
                ? $airtableService->deleteBarangaySubmissionBySubmissionId($this->uniqueKey ?? ($model?->submission_id ?? ''))
                : $airtableService->syncBarangaySubmission($model),
            // Pass action so the service can create vs update or delete
            'event' => $this->action === 'delete'
                ? $airtableService->deleteEventByEventId($this->uniqueKey ?? ($model?->event_id ?? ''))
                : $airtableService->syncEvent($model, $this->action),
            'event_reporting' => $airtableService->syncEventReporting($model),
            default => ['success' => false, 'error' => 'Unknown model type'],
        };
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Airtable sync job failed permanently', [
            'model_type' => $this->modelType,
            'model_id' => $this->modelId,
            'action' => $this->action,
            'error' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString()
        ]);
    }
}






