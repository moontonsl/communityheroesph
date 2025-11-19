<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Ensure session cookie is set correctly for 127.0.0.1
        if (request()->getHost() === '127.0.0.1:8900' || request()->getHost() === '127.0.0.1') {
            config(['session.domain' => '127.0.0.1']);
        }
    }
}
