<?php
namespace Database\Seeders;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@chronos.com'],
            ['name' => 'Admin', 'password' => Hash::make('password'), 'role_id' => 1]
        );
        User::firstOrCreate(
            ['email' => 'user@chronos.com'],
            ['name' => 'Demo Customer', 'password' => Hash::make('password'), 'role_id' => 2]
        );
    }
}
