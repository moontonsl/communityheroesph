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
        Schema::table('barangay_submissions', function (Blueprint $table) {
            $table->enum('status', ['PENDING', 'PRE_APPROVED', 'APPROVED', 'REJECTED', 'UNDER_REVIEW', 'RENEW'])->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('barangay_submissions', function (Blueprint $table) {
            $table->enum('status', ['PENDING', 'PRE_APPROVED', 'APPROVED', 'REJECTED', 'UNDER_REVIEW'])->change();
        });
    }
};
