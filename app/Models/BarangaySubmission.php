<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
        'tier',
        'successful_events_count',
        'tier_updated_at',
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
        'tier_updated_at' => 'datetime',
        'population' => 'integer',
        'successful_events_count' => 'integer'
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

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

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

    public function approve(User $user, string $notes = null): void
    {
        $this->update([
            'status' => 'APPROVED',
            'tier' => 'BRONZE', // Default tier for new approvals
            'successful_events_count' => 0,
            'tier_updated_at' => now(),
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

    public function isBronze(): bool
    {
        return $this->tier === 'BRONZE';
    }

    public function isSilver(): bool
    {
        return $this->tier === 'SILVER';
    }

    public function isGold(): bool
    {
        return $this->tier === 'GOLD';
    }

    public function isPlatinum(): bool
    {
        return $this->tier === 'PLATINUM';
    }

    public function getTierDisplayName(): string
    {
        return match($this->tier) {
            'BRONZE' => 'Bronze Tier',
            'SILVER' => 'Silver Tier',
            'GOLD' => 'Gold Tier',
            'PLATINUM' => 'Platinum Tier',
            default => 'Unknown Tier'
        };
    }

    public function getTierColor(): string
    {
        return match($this->tier) {
            'BRONZE' => 'text-yellow-600',
            'SILVER' => 'text-gray-400',
            'GOLD' => 'text-yellow-400',
            'PLATINUM' => 'text-purple-400',
            default => 'text-gray-500'
        };
    }

    public function getTierBadgeColor(): string
    {
        return match($this->tier) {
            'BRONZE' => 'bg-yellow-100 text-yellow-800',
            'SILVER' => 'bg-gray-100 text-gray-800',
            'GOLD' => 'bg-yellow-100 text-yellow-800',
            'PLATINUM' => 'bg-purple-100 text-purple-800',
            default => 'bg-gray-100 text-gray-800'
        };
    }

    public function incrementSuccessfulEvents(): void
    {
        $this->increment('successful_events_count');
        $this->checkAndUpgradeTier();
    }

    public function checkAndUpgradeTier(): void
    {
        $newTier = $this->calculateTierFromEvents($this->successful_events_count);
        
        if ($newTier !== $this->tier) {
            $this->update([
                'tier' => $newTier,
                'tier_updated_at' => now()
            ]);
        }
    }

    public function calculateTierFromEvents(int $eventCount): string
    {
        return match(true) {
            $eventCount >= 6 => 'PLATINUM',
            $eventCount >= 4 => 'GOLD',
            $eventCount >= 2 => 'SILVER',
            default => 'BRONZE'
        };
    }

    public function scopeBronze($query)
    {
        return $query->where('tier', 'BRONZE');
    }

    public function scopeSilver($query)
    {
        return $query->where('tier', 'SILVER');
    }

    public function scopeGold($query)
    {
        return $query->where('tier', 'GOLD');
    }

    public function scopePlatinum($query)
    {
        return $query->where('tier', 'PLATINUM');
    }
}
