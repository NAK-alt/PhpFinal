<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        // Return basic user list (customers)
        $users = User::select('id', 'name', 'email')
            ->where('role_id', 2)
            ->orderBy('name')
            ->get();

        return response()->json($users);
    }
}
