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
            $table->date('moa_expiry_date')->nullable()->after('approved_at');
            $table->boolean('is_moa_expired')->default(false)->after('moa_expiry_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('barangay_submissions', function (Blueprint $table) {
            $table->dropColumn(['moa_expiry_date', 'is_moa_expired']);
        });
    }
};
