<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Models\Order;
use App\Models\ContactMessage;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AdminStatsController extends Controller
{
    public function index(Request $request)
    {
        $month = (int) $request->query('month', 0);
        $year = (int) $request->query('year', 0);

        $filterStart = null;
        $filterEnd = null;
        if ($month >= 1 && $month <= 12 && $year > 0) {
            $filterStart = Carbon::createFromDate($year, $month, 1)->startOfMonth();
            $filterEnd = (clone $filterStart)->endOfMonth();
        }

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

        $soldQuery = OrderItem::select('order_items.product_id', DB::raw('COALESCE(SUM(order_items.quantity), 0) as total_sold'))
            ->join('orders', 'orders.id', '=', 'order_items.order_id');
        if ($filterStart && $filterEnd) {
            $soldQuery->whereBetween('orders.created_at', [$filterStart, $filterEnd]);
        }
        $soldQuantities = $soldQuery->groupBy('order_items.product_id')->pluck('total_sold', 'product_id');

        $productQuery = Product::query();
        if ($filterStart && $filterEnd) {
            $productQuery->whereBetween('created_at', [$filterStart, $filterEnd]);
        }
        $recentStockProducts = $productQuery->latest()->take(6)->get(['id', 'name', 'brand', 'stock', 'created_at'])
            ->map(function (Product $product) use ($soldQuantities) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'brand' => $product->brand,
                    'stock' => $product->stock,
                    'bought_quantity' => (int) ($soldQuantities[$product->id] ?? 0),
                    'created_at' => $product->created_at,
                ];
            });

        $topBoughtQuery = OrderItem::join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->select(
                'products.id',
                'products.name',
                'products.brand',
                'products.stock',
                'products.image',
                DB::raw('SUM(order_items.quantity) as total_bought'),
                DB::raw('MAX(order_items.price) as price')
            );
        if ($filterStart && $filterEnd) {
            $topBoughtQuery->whereBetween('orders.created_at', [$filterStart, $filterEnd]);
        }
        $topBoughtProducts = $topBoughtQuery->groupBy('products.id', 'products.name', 'products.brand', 'products.stock')
            ->orderByDesc('total_bought')
            ->take(6)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'brand' => $product->brand,
                    'stock' => (int) $product->stock,
                    'total_bought' => (int) $product->total_bought,
                    'price' => (float) $product->price,
                    'image' => $product->image ?? null,
                ];
            });

        return response()->json([
            'total_products'  => Product::count(),
            'total_stock_units' => (int) Product::sum('stock'),
            'active_products' => Product::where('is_active', true)->count(),
            'low_stock_products' => Product::where('stock', '<=', 5)->count(),
            'total_users'     => User::where('role_id', 2)->count(),
            'total_orders'    => $totalOrders,
            'total_sold_units' => (int) OrderItem::sum('quantity'),
            'pending_orders'  => Order::where('status', 'pending')->count(),
            'monthly_orders'  => Order::where('created_at', '>=', $monthStart)->count(),
            'unread_messages' => ContactMessage::where('is_read', false)->count(),
            'gross_revenue'   => round($grossRevenue, 2),
            'monthly_revenue' => round($monthlyRevenue, 2),
            'average_order_value' => round($totalOrders > 0 ? $grossRevenue / $totalOrders : 0, 2),
            'recent_orders'   => $recentOrders,
            'recent_stock_products' => $recentStockProducts,
            'top_bought_products' => $topBoughtProducts,
        ]);
    }
}
