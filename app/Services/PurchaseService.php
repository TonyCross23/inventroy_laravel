<?php

namespace App\Services;

use App\Models\{Purchase, Product};
use App\Interfaces\Services\PurchaseServiceInterface;
use App\Interfaces\DTOs\PurchaseDTOInterface;
use Illuminate\Support\Facades\DB;

class PurchaseService implements PurchaseServiceInterface
{
    public function getAllPurchases(string $search = '')
    {
        return Purchase::with('product')
            ->when($search, fn($q) => $q->whereHas('product', fn($pq) => $pq->where('name', 'like', "%{$search}%")))
            ->latest()->paginate(10)->withQueryString();
    }

    public function storePurchase(PurchaseDTOInterface $dto): Purchase
    {
        return DB::transaction(function () use ($dto) {
            $purchase = Purchase::create($dto->toArray());

            $product = Product::findOrFail($dto->getProductId());
            $product->increment('stock', $dto->getQty());

            $product->update([
                'buying_price' => $dto->getUnitPurchasePrice()
            ]);

            return $purchase;
        });
    }

    public function deletePurchase(Purchase $purchase): bool
    {
        return DB::transaction(function () use ($purchase) {
            $purchase->product->decrement('stock', $purchase->qty);
            return $purchase->delete();
        });
    }
}
