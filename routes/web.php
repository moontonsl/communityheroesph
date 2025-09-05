<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('homepage');
})->name('home');

Route::get('/homepage', function () {
    return Inertia::render('homepage');
})->name('homepage');

Route::get('/registerbarangay', function () {
    return Inertia::render('registerbarangay');
})->name('registerbarangay');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
