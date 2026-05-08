<?php
namespace App\Http\Controllers;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('features')->where('is_active', true);
        if ($request->category) $query->where('category', $request->category);
        if ($request->search) {
            $s = '%' . $request->search . '%';
            $query->where(fn($q) => $q->where('name','like',$s)->orWhere('brand','like',$s));
        }
        switch ($request->sort) {
            case 'price-low':  $query->orderBy('price'); break;
            case 'price-high': $query->orderBy('price', 'desc'); break;
            case 'brand':      $query->orderBy('brand'); break;
            default:           $query->orderBy('name');
        }
        if ($request->featured) return response()->json($query->limit(3)->get());
        return response()->json($query->paginate($request->per_page ?? 12));
    }

    public function show(Product $product)
    {
        return response()->json($product->load('features'));
    }
}
