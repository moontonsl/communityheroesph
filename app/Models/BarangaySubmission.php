<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class BarangaySubmission extends Model
{
    protected $fillable = [
        'region_id',
        'province_id',
        'municipality_id',
        'barangay_id',
        'region_name',
        'province_name',
        'municipality_name',
        'barangay_name',
        'zip_code',
        'population',
        'second_party_name',
        'position',
        'date_signed',
        'stage',
        'moa_file_path',
        'moa_file_name',
        'status',
        'rejection_reason',
        'admin_notes',
        'approved_by',
        'approved_at',
        'reviewed_by',
        'reviewed_at',
        'submission_id',
        'submitted_from_ip',
        'user_agent'
    ];

    protected $casts = [
        'date_signed' => 'date',
        'approved_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'population' => 'integer'
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            if (empty($model->submission_id)) {
                $model->submission_id = 'CH-' . strtoupper(Str::random(8));
            }
        });
    }

    // Relationships
    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class);
    }

    public function municipality(): BelongsTo
    {
        return $this->belongsTo(Municipality::class);
    }

    public function barangay(): BelongsTo
    {
        return $this->belongsTo(Barangay::class);
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    // Status methods
    public function isPending(): bool
    {
        return $this->status === 'PENDING';
    }

    public function isApproved(): bool
    {
        return $this->status === 'APPROVED';
    }

    public function isRejected(): bool
    {
        return $this->status === 'REJECTED';
    }

    public function isUnderReview(): bool
    {
        return $this->status === 'UNDER_REVIEW';
    }

    // Status change methods
    public function approve(User $user, string $notes = null): void
    {
        $this->update([
            'status' => 'APPROVED',
            'approved_by' => $user->id,
            'approved_at' => now(),
            'admin_notes' => $notes
        ]);
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
    }

    public function markUnderReview(User $user, string $notes = null): void
    {
        $this->update([
            'status' => 'UNDER_REVIEW',
            'reviewed_by' => $user->id,
            'reviewed_at' => now(),
            'admin_notes' => $notes
        ]);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'PENDING');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'APPROVED');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'REJECTED');
    }

    public function scopeUnderReview($query)
    {
        return $query->where('status', 'UNDER_REVIEW');
    }
}
