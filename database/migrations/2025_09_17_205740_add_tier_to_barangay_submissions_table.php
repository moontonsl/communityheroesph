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
            $table->enum('tier', ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'])->default('BRONZE')->after('status');
            $table->integer('successful_events_count')->default(0)->after('tier');
            $table->timestamp('tier_updated_at')->nullable()->after('successful_events_count');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('barangay_submissions', function (Blueprint $table) {
            $table->dropColumn(['tier', 'successful_events_count', 'tier_updated_at']);
        });
    }
};
