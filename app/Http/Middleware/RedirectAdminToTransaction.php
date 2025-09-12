<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectAdminToTransaction
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated and is an admin
        if (auth()->check() && (auth()->user()->isSuperAdmin() || auth()->user()->isCommunityAdmin())) {
            // If admin tries to access dashboard, redirect to Transaction page
            if ($request->routeIs('dashboard')) {
                return redirect()->route('CHTransaction');
            }
        }

        return $next($request);
    }
}
