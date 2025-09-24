<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->enum('status', ['PENDING', 'PRE_APPROVED', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED', 'CLEARED'])
                  ->default('PENDING')
                  ->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->enum('status', ['PENDING', 'PRE_APPROVED', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED'])
                  ->default('PENDING')
                  ->change();
        });
    }
};