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

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

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

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public static function superAdmin(): self
    {
        return static::where('slug', 'super-admin')->first();
    }

    public static function communityAdmin(): self
    {
        return static::where('slug', 'community-admin')->first();
    }

    public static function areaAdmin(): self
    {
        return static::where('slug', 'area-admin')->first();
    }

    public static function communityLead(): self
    {
        return static::where('slug', 'community-lead')->first();
    }

    public static function superAdminA(): self
    {
        return static::where('slug', 'super-admin-a')->first();
    }

    public static function superAdminB(): self
    {
        return static::where('slug', 'super-admin-b')->first();
    }


}
