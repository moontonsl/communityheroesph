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
        Schema::table('event_reportings', function (Blueprint $table) {
            // Remove unnecessary fields
            $table->dropColumn([
                'actual_participants',
                'event_summary',
                'achievements',
                'challenges_faced',
                'lessons_learned',
                'recommendations'
            ]);
            
            // Add financial fields for Super Admin only
            $table->string('pic')->nullable()->after('campaign');
            $table->decimal('cash_allocation', 15, 2)->nullable()->after('pic');
            $table->integer('diamonds_expenditure')->nullable()->after('cash_allocation');
            $table->decimal('total_cost_php', 15, 2)->nullable()->after('diamonds_expenditure');
            
            // Add clearance status fields
            $table->enum('first_clearance_status', ['PENDING', 'CLEARED'])->default('PENDING')->after('status');
            $table->enum('final_clearance_status', ['PENDING', 'CLEARED'])->default('PENDING')->after('first_clearance_status');
            $table->foreignId('first_cleared_by')->nullable()->constrained('users')->onDelete('set null')->after('final_clearance_status');
            $table->timestamp('first_cleared_at')->nullable()->after('first_cleared_by');
            $table->foreignId('final_cleared_by')->nullable()->constrained('users')->onDelete('set null')->after('first_cleared_at');
            $table->timestamp('final_cleared_at')->nullable()->after('final_cleared_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('event_reportings', function (Blueprint $table) {
            // Add back removed fields
            $table->integer('actual_participants');
            $table->text('event_summary');
            $table->text('achievements');
            $table->text('challenges_faced');
            $table->text('lessons_learned');
            $table->text('recommendations');
            
            // Remove added fields
            $table->dropColumn([
                'pic',
                'cash_allocation',
                'diamonds_expenditure',
                'total_cost_php',
                'first_clearance_status',
                'final_clearance_status',
                'first_cleared_by',
                'first_cleared_at',
                'final_cleared_by',
                'final_cleared_at'
            ]);
        });
    }
};