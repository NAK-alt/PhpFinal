<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\User;
use App\Models\Order;
use App\Models\ContactMessage;
use Illuminate\Support\Facades\DB;

class AdminStatsController extends Controller
{
    public function index()
    {
        $totalOrders = Order::count();
        $grossRevenue = (float) Order::select(DB::raw('COALESCE(SUM(total_amount + tax_amount), 0) as total'))->value('total');
        $monthStart = now()->startOfMonth();
        $monthlyRevenue = (float) Order::where('created_at', '>=', $monthStart)
            ->select(DB::raw('COALESCE(SUM(total_amount + tax_amount), 0) as total'))
            ->value('total');

        $recentOrders = Order::with('user:id,name,email')
            ->withCount('items')
            ->latest()
            ->take(6)
            ->get(['id', 'user_id', 'status', 'total_amount', 'tax_amount', 'created_at'])
            ->map(function (Order $order) {
                return [
                    'id' => $order->id,
                    'status' => $order->status,
                    'items_count' => $order->items_count,
                    'total_with_tax' => round(((float) $order->total_amount + (float) $order->tax_amount), 2),
                    'created_at' => $order->created_at,
                    'user_name' => $order->user?->name,
                    'user_email' => $order->user?->email,
                ];
            });

        return response()->json([
            'total_products'  => Product::count(),
            'active_products' => Product::where('is_active', true)->count(),
            'low_stock_products' => Product::where('stock', '<=', 5)->count(),
            'total_users'     => User::where('role_id', 2)->count(),
            'total_orders'    => $totalOrders,
            'pending_orders'  => Order::where('status', 'pending')->count(),
            'monthly_orders'  => Order::where('created_at', '>=', $monthStart)->count(),
            'unread_messages' => ContactMessage::where('is_read', false)->count(),
            'gross_revenue'   => round($grossRevenue, 2),
            'monthly_revenue' => round($monthlyRevenue, 2),
            'average_order_value' => round($totalOrders > 0 ? $grossRevenue / $totalOrders : 0, 2),
            'recent_orders'   => $recentOrders,
        ]);
    }
}
