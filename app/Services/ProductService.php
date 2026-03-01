<?php

namespace App\Services;

use App\Models\Product;
use App\Interfaces\Services\ProductServiceInterface;
use App\Interfaces\DTOs\ProductDTOInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ProductService implements ProductServiceInterface
{
    public function getAllProducts(): LengthAwarePaginator
    {
        return Product::latest()->paginate(10);
    }

    public function storeProduct(ProductDTOInterface $dto): Product
    {
        return DB::transaction(fn() => Product::create($dto->toArray()));
    }

    public function updateProduct(Product $product, ProductDTOInterface $dto): Product
    {
        return DB::transaction(function () use ($product, $dto) {
            $product->update($dto->toArray());
            return $product;
        });
    }

    public function deleteProduct(Product $product): bool
    {
        return DB::transaction(fn() => $product->delete());
    }
}
