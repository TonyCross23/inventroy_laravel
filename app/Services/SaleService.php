<?php

namespace App\Services;

use App\Models\{Sale, Product};
use App\Interfaces\Services\SaleServiceInterface;
use App\Interfaces\DTOs\SaleDTOInterface;
use Illuminate\Support\Facades\DB;

class SaleService implements SaleServiceInterface
{
    public function getAllSales(string $search = '')
    {
        return Sale::with('product')
            ->when($search, fn($q) => $q->whereHas('product', fn($pq) => $pq->where('name', 'like', "%{$search}%")))
            ->latest()->paginate(10)->withQueryString();
    }

    public function storeSale(SaleDTOInterface $dto): Sale
    {
        return DB::transaction(function () use ($dto) {
            $sale = Sale::create($dto->toArray());

            Product::where('id', $dto->getProductId())->decrement('stock', $dto->getQty());

            return $sale;
        });
    }

    public function deleteSale(Sale $sale): bool
    {
        return DB::transaction(function () use ($sale) {
            $sale->product->increment('stock', $sale->qty);
            return $sale->delete();
        });
    }
}
