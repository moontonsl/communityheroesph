<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'permissions',
        'is_active'
    ];

    protected $casts = [
        'permissions' => 'array',
        'is_active' => 'boolean'
    ];

    // Relationships
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    // Permission methods
    public function hasPermission(string $permission): bool
    {
        if (!$this->permissions) {
            return false;
        }
        
        return in_array($permission, $this->permissions);
    }

    public function hasAnyPermission(array $permissions): bool
    {
        if (!$this->permissions) {
            return false;
        }
        
        return !empty(array_intersect($permissions, $this->permissions));
    }

    public function hasAllPermissions(array $permissions): bool
    {
        if (!$this->permissions) {
            return false;
        }
        
        return empty(array_diff($permissions, $this->permissions));
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Static methods for common roles
    public static function superAdmin(): self
    {
        return static::where('slug', 'super-admin')->first();
    }

    public static function communityAdmin(): self
    {
        return static::where('slug', 'community-admin')->first();
    }

    public static function regularUser(): self
    {
        return static::where('slug', 'regular-user')->first();
    }
}
