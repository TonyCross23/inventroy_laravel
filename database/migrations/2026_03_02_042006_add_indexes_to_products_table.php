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
        Schema::table('products', function (Blueprint $table) {
            $table->index('name');
            $table->index('created_at');
        });

        Schema::table('purchases', function (Blueprint $table) {
            $table->index('created_at');
        });

        Schema::table('sales', function (Blueprint $table) {
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function ($table) {
            $table->dropIndex(['name', 'created_at']);
        });
        Schema::table('purchases', function ($table) {
            $table->dropIndex(['product_id', 'created_at']);
        });
        Schema::table('sales', function ($table) {
            $table->dropIndex(['product_id', 'created_at']);
        });
    }
};
