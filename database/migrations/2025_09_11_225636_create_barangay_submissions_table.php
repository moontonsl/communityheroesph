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
        Schema::create('barangay_submissions', function (Blueprint $table) {
            $table->id();
            
            // Location information
            $table->foreignId('region_id')->constrained()->onDelete('cascade');
            $table->foreignId('province_id')->constrained()->onDelete('cascade');
            $table->foreignId('municipality_id')->constrained()->onDelete('cascade');
            $table->foreignId('barangay_id')->constrained()->onDelete('cascade');
            
            // Additional location details
            $table->string('region_name');
            $table->string('province_name');
            $table->string('municipality_name');
            $table->string('barangay_name');
            $table->string('zip_code')->nullable();
            $table->integer('population')->nullable();
            
            // MOA details
            $table->string('second_party_name');
            $table->string('position');
            $table->date('date_signed');
            $table->enum('stage', ['NEW', 'RENEWAL']);
            
            // File information
            $table->string('moa_file_path');
            $table->string('moa_file_name');
            
            // Submission status
            $table->enum('status', ['PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW'])->default('PENDING');
            $table->text('rejection_reason')->nullable();
            $table->text('admin_notes')->nullable();
            
            // Approval information
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('reviewed_at')->nullable();
            
            // Submission tracking
            $table->string('submission_id')->unique(); // For reference
            $table->ipAddress('submitted_from_ip')->nullable();
            $table->text('user_agent')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index(['status', 'created_at']);
            $table->index(['barangay_id', 'status']);
            $table->index('submission_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barangay_submissions');
    }
};
