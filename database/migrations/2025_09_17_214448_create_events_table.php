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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('event_id')->unique(); // CH-EVENT-XXXXXX
            $table->unsignedBigInteger('barangay_submission_id');
            $table->unsignedBigInteger('applied_by'); // User who applied
            $table->string('event_name');
            $table->text('event_description');
            $table->date('event_date');
            $table->time('event_start_time');
            $table->time('event_end_time');
            $table->string('event_location');
            $table->integer('expected_participants');
            $table->enum('status', ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED'])->default('PENDING');
            $table->text('rejection_reason')->nullable();
            $table->text('admin_notes')->nullable();
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->unsignedBigInteger('reviewed_by')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->boolean('is_successful')->default(false); // For tier progression
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->foreign('barangay_submission_id')->references('id')->on('barangay_submissions')->onDelete('cascade');
            $table->foreign('applied_by')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('approved_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('reviewed_by')->references('id')->on('users')->onDelete('set null');

            $table->index(['status', 'event_date']);
            $table->index(['barangay_submission_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
