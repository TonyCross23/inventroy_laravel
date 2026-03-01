<?php

namespace App\Interfaces\Services;

use App\Models\Product;
use App\Interfaces\DTOs\ProductDTOInterface;
use Illuminate\Pagination\LengthAwarePaginator;

interface ProductServiceInterface
{
    public function getAllProducts(): LengthAwarePaginator;
    public function storeProduct(ProductDTOInterface $dto): Product;
    public function updateProduct(Product $product, ProductDTOInterface $dto): Product;
    public function deleteProduct(Product $product): bool;
}
