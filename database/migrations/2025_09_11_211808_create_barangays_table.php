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
        Schema::create('barangays', function (Blueprint $table) {
            $table->id();
            $table->foreignId('municipality_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('psgc_code')->unique();
            $table->integer('population')->nullable();
            $table->timestamps();
            
            $table->index('name');
            $table->index(['municipality_id', 'name']);
            $table->index('psgc_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barangays');
    }
};
