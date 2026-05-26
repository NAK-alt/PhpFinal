<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'recipient_name')) {
                $table->string('recipient_name')->nullable()->after('user_id');
            }
            if (!Schema::hasColumn('orders', 'phone')) {
                $table->string('phone')->nullable()->after('recipient_name');
            }
            if (!Schema::hasColumn('orders', 'address_line1')) {
                $table->string('address_line1')->nullable()->after('phone');
            }
            if (!Schema::hasColumn('orders', 'address_line2')) {
                $table->string('address_line2')->nullable()->after('address_line1');
            }
            if (!Schema::hasColumn('orders', 'city')) {
                $table->string('city')->nullable()->after('address_line2');
            }
            if (Schema::hasColumn('orders', 'state')) {
                // remove the `state` column as requested
                $table->dropColumn('state');
            }
            if (!Schema::hasColumn('orders', 'postal_code')) {
                $table->string('postal_code')->nullable()->after('city');
            }
            if (!Schema::hasColumn('orders', 'country')) {
                $table->string('country')->nullable()->after('postal_code');
            }
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // attempt best-effort reversal: re-add state column and drop added address fields
            if (!Schema::hasColumn('orders', 'state')) {
                $table->string('state')->nullable()->after('city');
            }
            if (Schema::hasColumn('orders', 'recipient_name')) $table->dropColumn('recipient_name');
            if (Schema::hasColumn('orders', 'phone')) $table->dropColumn('phone');
            if (Schema::hasColumn('orders', 'address_line1')) $table->dropColumn('address_line1');
            if (Schema::hasColumn('orders', 'address_line2')) $table->dropColumn('address_line2');
            if (Schema::hasColumn('orders', 'city')) $table->dropColumn('city');
            if (Schema::hasColumn('orders', 'postal_code')) $table->dropColumn('postal_code');
            if (Schema::hasColumn('orders', 'country')) $table->dropColumn('country');
        });
    }
};
