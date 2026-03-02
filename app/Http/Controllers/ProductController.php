<?php

namespace App\Http\Controllers;

use App\Interfaces\Services\ProductServiceInterface;
use App\DTOs\ProductDTO;
use App\Http\Requests\StoreProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function __construct(protected ProductServiceInterface $productService) {}

    public function index(Request $request)
    {
        $search = $request->input('search', '');

        $products = Product::query()
            ->select('id', 'name', 'stock', 'buying_price', 'created_at')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'filters' => [
                'search' => $search
            ]
        ]);
    }

    public function store(StoreProductRequest $request)
    {
        $dto = new ProductDTO(...$request->validated());
        $this->productService->storeProduct($dto);
        return redirect()->back()->with('success', 'Product Created');
    }

    public function update(StoreProductRequest $request, Product $product)
    {
        $dto = new ProductDTO(...$request->validated());
        $this->productService->updateProduct($product, $dto);
        return redirect()->back()->with('success', 'Product Updated');
    }

    public function destroy(Product $product)
    {
        $this->productService->deleteProduct($product);
        return redirect()->back()->with('success', 'Product Deleted');
    }
}
