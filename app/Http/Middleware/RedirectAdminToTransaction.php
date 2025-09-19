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
        if (auth()->check() && (auth()->user()->isSuperAdmin() || auth()->user()->isCommunityAdmin())) {
            if ($request->routeIs('dashboard')) {
                return redirect()->route('CHTransaction');
            }
        }

        return $next($request);
    }
}
