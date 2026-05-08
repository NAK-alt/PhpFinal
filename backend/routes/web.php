<?php
use Illuminate\Support\Facades\Route;
Route::get('/', fn() => response()->json(['app' => 'Chronos Luxury API', 'status' => 'running']));
