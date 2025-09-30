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
        Schema::create('event_reportings', function (Blueprint $table) {
            $table->id();
            $table->string('report_id')->unique();
            $table->foreignId('event_id')->constrained('events')->onDelete('cascade');
            $table->foreignId('reported_by')->constrained('users')->onDelete('cascade');
            $table->string('event_name');
            $table->text('event_description');
            $table->date('event_date');
            $table->string('event_location');
            $table->string('campaign');
            $table->integer('actual_participants');
            $table->text('event_summary');
            $table->text('achievements');
            $table->text('challenges_faced');
            $table->text('lessons_learned');
            $table->text('recommendations');
            $table->string('post_event_file_path')->nullable();
            $table->string('post_event_file_name')->nullable();
            $table->enum('status', ['DRAFT', 'SUBMITTED', 'REVIEWED', 'APPROVED'])->default('DRAFT');
            $table->text('admin_notes')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('reviewed_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_reportings');
    }
};
