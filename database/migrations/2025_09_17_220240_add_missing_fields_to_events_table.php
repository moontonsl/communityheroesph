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
            $table->string('event_type')->nullable()->after('expected_participants');
            $table->string('contact_person')->nullable()->after('event_type');
            $table->string('contact_number')->nullable()->after('contact_person');
            $table->string('contact_email')->nullable()->after('contact_number');
            $table->text('requirements')->nullable()->after('contact_email');
            $table->string('proposal_file_path')->nullable()->after('requirements');
            $table->string('proposal_file_name')->nullable()->after('proposal_file_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn([
                'event_type',
                'contact_person',
                'contact_number',
                'contact_email',
                'requirements',
                'proposal_file_path',
                'proposal_file_name'
            ]);
        });
    }
};
