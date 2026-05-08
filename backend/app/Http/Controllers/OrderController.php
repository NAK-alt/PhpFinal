<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->orders()->with('items')->latest()->get());
    }

    public function show(Request $request, Order $order)
    {
        abort_if($order->user_id !== $request->user()->id, 403);
        return response()->json($order->load('items'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'recipient_name' => 'required|string|max:255',
            'phone' => 'required|string|max:50',
            'address_line1' => 'required|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city' => 'required|string|max:120',
            'state' => 'required|string|max:120',
            'postal_code' => 'required|string|max:30',
            'country' => 'required|string|max:120',
        ]);
        $cart = Cart::where('user_id', $request->user()->id)->with('items.product')->first();
        abort_if(!$cart || $cart->items->isEmpty(), 422, 'Cart is empty.');

        return DB::transaction(function () use ($request, $cart, $data) {
            $subtotal = $cart->items->sum(fn($i) => $i->product->price * $i->quantity);
            $tax = $subtotal * 0.10;
            $order = Order::create([
                'user_id'      => $request->user()->id,
                'recipient_name' => $data['recipient_name'],
                'phone' => $data['phone'],
                'address_line1' => $data['address_line1'],
                'address_line2' => $data['address_line2'] ?? null,
                'city' => $data['city'],
                'state' => $data['state'],
                'postal_code' => $data['postal_code'],
                'country' => $data['country'],
                'total_amount' => $subtotal,
                'tax_amount'   => $tax,
                'status'       => 'pending',
            ]);
            foreach ($cart->items as $item) {
                $order->items()->create([
                    'product_id'   => $item->product_id,
                    'product_name' => $item->product->name,
                    'price'        => $item->product->price,
                    'quantity'     => $item->quantity,
                ]);
            }
            $cart->items()->delete();
            return response()->json($order->load('items'), 201);
        });
    }
}
