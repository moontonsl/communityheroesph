<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Event extends Model
{
    protected $fillable = [
        'event_id',
        'barangay_submission_id',
        'applied_by',
        'assigned_user_id',
        'event_name',
        'event_description',
        'event_date',
        'campaign',
        'event_start_time',
        'event_end_time',
        'event_location',
        'expected_participants',
        'event_type',
        'contact_person',
        'contact_number',
        'contact_email',
        'requirements',
        'proposal_file_path',
        'proposal_file_name',
        'moa_file_path',
        'moa_file_name',
        'status',
        'rejection_reason',
        'admin_notes',
        'approved_by',
        'approved_at',
        'reviewed_by',
        'reviewed_at',
        'is_successful',
        'completed_at'
    ];

    protected $casts = [
        'event_date' => 'date',
        'event_start_time' => 'datetime:H:i',
        'event_end_time' => 'datetime:H:i',
        'approved_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'completed_at' => 'datetime',
        'is_successful' => 'boolean',
        'expected_participants' => 'integer'
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            if (empty($model->event_id)) {
                $model->event_id = 'CH-EVENT-' . strtoupper(Str::random(6));
            }
        });

        static::deleting(function ($model) {
            if (config('airtable.sync.enabled', true)) {
                try {
                    \App\Jobs\SyncToAirtableJob::dispatch('event', $model->id, 'delete', $model->event_id);
                    \Log::info('Airtable delete job dispatched for event', [
                        'event_id' => $model->event_id,
                        'id' => $model->id,
                    ]);
                } catch (\Exception $e) {
                    \Log::error('Failed to dispatch Airtable delete job for event', [
                        'event_id' => $model->event_id,
                        'id' => $model->id,
                        'error' => $e->getMessage()
                    ]);
                }
            }
        });
    }

    public function barangaySubmission(): BelongsTo
    {
        return $this->belongsTo(BarangaySubmission::class, 'barangay_submission_id');
    }

    public function appliedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'applied_by');
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function isPending(): bool
    {
        return $this->status === 'PENDING';
    }

    public function isPreApproved(): bool
    {
        return $this->status === 'PRE_APPROVED';
    }

    public function isApproved(): bool
    {
        return $this->status === 'APPROVED';
    }

    public function isRejected(): bool
    {
        return $this->status === 'REJECTED';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'COMPLETED';
    }

    public function isCancelled(): bool
    {
        return $this->status === 'CANCELLED';
    }

    public function isCleared(): bool
    {
        return $this->status === 'CLEARED';
    }

    public function preApprove(User $user, string $notes = null): void
    {
        $this->update([
            'status' => 'PRE_APPROVED',
            'reviewed_by' => $user->id,
            'reviewed_at' => now(),
            'admin_notes' => $notes
        ]);

        // Sync to Airtable
        $this->syncToAirtable();
    }

    public function finalApprove(User $user, string $notes = null): void
    {
        $this->update([
            'status' => 'APPROVED',
            'approved_by' => $user->id,
            'approved_at' => now(),
            'admin_notes' => $notes
        ]);
    }

    public function approve(User $user, string $notes = null): void
    {
        $this->update([
            'status' => 'APPROVED',
            'approved_by' => $user->id,
            'approved_at' => now(),
            'admin_notes' => $notes
        ]);

        // Sync to Airtable
        $this->syncToAirtable();
    }

    public function reject(User $user, string $reason, string $notes = null): void
    {
        $this->update([
            'status' => 'REJECTED',
            'reviewed_by' => $user->id,
            'reviewed_at' => now(),
            'rejection_reason' => $reason,
            'admin_notes' => $notes
        ]);

        // Sync to Airtable
        $this->syncToAirtable();
    }

    public function markCompleted(User $user, bool $successful = true): void
    {
        $this->update([
            'status' => 'COMPLETED',
            'is_successful' => $successful,
            'completed_at' => now(),
            'reviewed_by' => $user->id,
            'reviewed_at' => now()
        ]);

        if ($successful) {
            $this->barangaySubmission->incrementSuccessfulEvents();
        }
    }

    public function cancel(User $user, string $reason = null): void
    {
        $this->update([
            'status' => 'CANCELLED',
            'rejection_reason' => $reason,
            'reviewed_by' => $user->id,
            'reviewed_at' => now()
        ]);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'PENDING');
    }

    public function scopePreApproved($query)
    {
        return $query->where('status', 'PRE_APPROVED');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'APPROVED');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'REJECTED');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'COMPLETED');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'CANCELLED');
    }

    public function scopeCleared($query)
    {
        return $query->where('status', 'CLEARED');
    }

    public function scopeSuccessful($query)
    {
        return $query->where('is_successful', true);
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('applied_by', $userId);
    }

    public function scopeByBarangay($query, $barangaySubmissionId)
    {
        return $query->where('barangay_submission_id', $barangaySubmissionId);
    }

    /**
     * Sync this event to Airtable
     */
    private function syncToAirtable(): void
    {
        if (config('airtable.sync.enabled', true)) {
            try {
                if (config('airtable.sync.immediate', false)) {
                    \App\Jobs\SyncToAirtableJob::dispatchSync('event', $this->id, 'update');
                    \Log::info('Airtable sync executed immediately for event update', [
                        'event_id' => $this->event_id,
                        'id' => $this->id,
                        'status' => $this->status
                    ]);
                } else {
                    \App\Jobs\SyncToAirtableJob::dispatch('event', $this->id, 'update');
                    \Log::info('Airtable sync job dispatched for event update', [
                        'event_id' => $this->event_id,
                        'id' => $this->id,
                        'status' => $this->status
                    ]);
                }
            } catch (\Exception $e) {
                \Log::error('Failed to queue/execute Airtable sync for event update', [
                    'event_id' => $this->event_id,
                    'id' => $this->id,
                    'error' => $e->getMessage()
                ]);
                // Don't fail the main operation if Airtable sync fails
            }
        }
    }
}
