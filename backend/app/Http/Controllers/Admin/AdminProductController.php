<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class AdminProductController extends Controller
{
    public function index()
    {
        return response()->json(Product::with('features')->latest()->paginate(50));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'brand'       => 'required|string|max:100',
            'price'       => 'required|numeric|min:0',
            'image'       => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'category'    => 'required|in:diving,dress,sport,luxury',
            'stock'       => 'required|integer|min:0',
        ]);
        $product = Product::create($data);
        return response()->json($product->load('features'), 201);
    }

    public function show(Product $product)
    {
        return response()->json($product->load('features'));
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'brand'       => 'sometimes|string|max:100',
            'price'       => 'sometimes|numeric|min:0',
            'image'       => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'category'    => 'sometimes|in:diving,dress,sport,luxury',
            'stock'       => 'sometimes|integer|min:0',
            'is_active'   => 'sometimes|boolean',
        ]);
        $product->update($data);
        return response()->json($product->fresh()->load('features'));
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(['message' => 'Deleted.']);
    }
}
