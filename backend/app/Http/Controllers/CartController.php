<?php
namespace App\Http\Controllers;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    private function getOrCreateCart(Request $request): Cart
    {
        return Cart::firstOrCreate(['user_id' => $request->user()->id]);
    }

    public function index(Request $request)
    {
        $cart = $this->getOrCreateCart($request);
        return response()->json($cart->load('items.product'));
    }

    public function addItem(Request $request)
    {
        $data = $request->validate(['product_id' => 'required|exists:products,id', 'quantity' => 'integer|min:1']);
        $cart = $this->getOrCreateCart($request);
        $item = $cart->items()->where('product_id', $data['product_id'])->first();
        if ($item) {
            $item->increment('quantity', $data['quantity'] ?? 1);
        } else {
            $item = $cart->items()->create(['product_id' => $data['product_id'], 'quantity' => $data['quantity'] ?? 1]);
        }
        return response()->json($item->load('product'), 201);
    }

    public function updateItem(Request $request, CartItem $cartItem)
    {
        $this->authorize('update', $cartItem);
        $data = $request->validate(['quantity' => 'required|integer|min:1']);
        $cartItem->update($data);
        return response()->json($cartItem->load('product'));
    }

    public function removeItem(Request $request, CartItem $cartItem)
    {
        $this->authorize('delete', $cartItem);
        $cartItem->delete();
        return response()->json(['message' => 'Removed.']);
    }
}
