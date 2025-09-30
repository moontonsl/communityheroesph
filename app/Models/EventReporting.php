<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class EventReporting extends Model
{
    protected $fillable = [
        'report_id',
        'event_id',
        'reported_by',
        'event_name',
        'event_description',
        'event_date',
        'event_location',
        'campaign',
        'pic',
        'cash_allocation',
        'diamonds_expenditure',
        'total_cost_php',
        'post_event_file_path',
        'post_event_file_name',
        'status',
        'first_clearance_status',
        'final_clearance_status',
        'admin_notes',
        'reviewed_by',
        'reviewed_at',
        'approved_by',
        'approved_at',
        'first_cleared_by',
        'first_cleared_at',
        'final_cleared_by',
        'final_cleared_at'
    ];

    protected $casts = [
        'event_date' => 'date',
        'reviewed_at' => 'datetime',
        'approved_at' => 'datetime',
        'first_cleared_at' => 'datetime',
        'final_cleared_at' => 'datetime',
        'cash_allocation' => 'decimal:2',
        'total_cost_php' => 'decimal:2',
        'diamonds_expenditure' => 'integer'
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            if (empty($model->report_id)) {
                $model->report_id = 'CH-REPORT-' . strtoupper(Str::random(6));
            }
        });
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function reportedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reported_by');
    }

    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function firstClearedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'first_cleared_by');
    }

    public function finalClearedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'final_cleared_by');
    }

    public function isDraft(): bool
    {
        return $this->status === 'DRAFT';
    }

    public function isSubmitted(): bool
    {
        return $this->status === 'SUBMITTED';
    }

    public function isPreApproved(): bool
    {
        return $this->status === 'PRE_APPROVED';
    }

    public function isReviewed(): bool
    {
        return $this->status === 'REVIEWED';
    }

    public function isApproved(): bool
    {
        return $this->status === 'APPROVED';
    }

    public function isFirstCleared(): bool
    {
        return $this->first_clearance_status === 'CLEARED';
    }

    public function isFinalCleared(): bool
    {
        return $this->final_clearance_status === 'CLEARED';
    }

    public function submit(): void
    {
        $this->update(['status' => 'SUBMITTED']);
    }

    public function preApprove(User $user, ?string $adminNotes = null): void
    {
        $this->update([
            'status' => 'PRE_APPROVED',
            'reviewed_by' => $user->id,
            'reviewed_at' => now(),
            'admin_notes' => $adminNotes
        ]);
    }

    public function review(User $user, string $notes = null): void
    {
        $this->update([
            'status' => 'REVIEWED',
            'reviewed_by' => $user->id,
            'reviewed_at' => now(),
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
    }

    public function firstClear(User $user): void
    {
        $this->update([
            'first_clearance_status' => 'CLEARED',
            'first_cleared_by' => $user->id,
            'first_cleared_at' => now()
        ]);
    }

    public function finalClear(User $user): void
    {
        $this->update([
            'final_clearance_status' => 'CLEARED',
            'final_cleared_by' => $user->id,
            'final_cleared_at' => now()
        ]);
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'DRAFT');
    }

    public function scopeSubmitted($query)
    {
        return $query->where('status', 'SUBMITTED');
    }

    public function scopePreApproved($query)
    {
        return $query->where('status', 'PRE_APPROVED');
    }

    public function scopeReviewed($query)
    {
        return $query->where('status', 'REVIEWED');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'APPROVED');
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('reported_by', $userId);
    }

    public function scopeByEvent($query, $eventId)
    {
        return $query->where('event_id', $eventId);
    }

    public function scopeFirstCleared($query)
    {
        return $query->where('first_clearance_status', 'CLEARED');
    }

    public function scopeFinalCleared($query)
    {
        return $query->where('final_clearance_status', 'CLEARED');
    }

    public function scopePendingFirstClearance($query)
    {
        return $query->where('first_clearance_status', 'PENDING');
    }

    public function scopePendingFinalClearance($query)
    {
        return $query->where('final_clearance_status', 'PENDING');
    }
}
