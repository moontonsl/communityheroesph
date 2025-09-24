<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRolePermissions
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user = $request->user();
        
        if (!$user || !$user->role) {
            abort(403, 'Access denied. No role assigned.');
        }

        $rolePermissions = $user->role->permissions ?? [];
        
        if (!in_array($permission, $rolePermissions)) {
            abort(403, 'Access denied. Insufficient permissions.');
        }

        return $next($request);
    }
}
