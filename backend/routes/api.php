<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\Admin\AdminContactController;
use App\Http\Controllers\Admin\AdminStatsController;
use App\Http\Controllers\Admin\AdminOrderController;

// Public
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login'])->middleware('throttle:10,1');
Route::get('/products',           [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::post('/contact',           [ContactController::class, 'store']);

// Auth required
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user',    [AuthController::class, 'user']);

    Route::get('/cart',            [CartController::class, 'index']);
    Route::post('/cart',            [CartController::class, 'addItem']);
    Route::put('/cart/{cartItem}', [CartController::class, 'updateItem']);
    Route::delete('/cart/{cartItem}', [CartController::class, 'removeItem']);

    Route::post('/orders',         [OrderController::class, 'store']);
    Route::get('/orders',         [OrderController::class, 'index']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
});

// Admin only
Route::middleware(['auth:sanctum', 'is_admin'])->prefix('admin')->group(function () {
    Route::get('/stats', [AdminStatsController::class, 'index']);
    Route::get('/users', [\App\Http\Controllers\Admin\AdminUserController::class, 'index']);
    Route::apiResource('products', AdminProductController::class);
    Route::get('/contacts',               [AdminContactController::class, 'index']);
    Route::put('/contacts/{msg}/read',    [AdminContactController::class, 'markRead']);
    Route::get('/orders',                 [AdminOrderController::class, 'index']);
    Route::put('/orders/{order}/status',  [AdminOrderController::class, 'updateStatus']);
});
