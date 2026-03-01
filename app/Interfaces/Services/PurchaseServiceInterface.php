<?php

namespace App\Interfaces\Services;

use App\Interfaces\DTOs\PurchaseDTOInterface;
use App\Models\Purchase;

interface PurchaseServiceInterface
{
    public function getAllPurchases(string $search = '');
    public function storePurchase(PurchaseDTOInterface $dto): Purchase;
    public function deletePurchase(Purchase $purchase): bool;
}
