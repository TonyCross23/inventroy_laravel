<?php

namespace App\Interfaces\DTOs;

interface PurchaseDTOInterface
{
    public function getProductId(): int;
    public function getQty(): int;
    public function getUnitPurchasePrice(): float;
    public function toArray(): array;
}
