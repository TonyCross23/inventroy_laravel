<?php

namespace App\DTOs;

use App\Interfaces\DTOs\PurchaseDTOInterface;

readonly class PurchaseDTO implements PurchaseDTOInterface
{
    public function __construct(
        private int $product_id,
        private int $qty,
        private float $unit_purchase_price
    ) {}

    public function getProductId(): int
    {
        return $this->product_id;
    }
    public function getQty(): int
    {
        return $this->qty;
    }
    public function getUnitPurchasePrice(): float
    {
        return $this->unit_purchase_price;
    }

    public function toArray(): array
    {
        return [
            'product_id' => $this->product_id,
            'qty' => $this->qty,
            'unit_purchase_price' => $this->unit_purchase_price,
        ];
    }
}
