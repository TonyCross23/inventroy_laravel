<?php

namespace App\DTOs;

use App\Interfaces\DTOs\SaleDTOInterface;

readonly class SaleDTO implements SaleDTOInterface
{
    public function __construct(
        private int $product_id,
        private int $qty,
        private float $unit_selling_price
    ) {}

    public function getProductId(): int
    {
        return $this->product_id;
    }
    public function getQty(): int
    {
        return $this->qty;
    }
    public function getUnitSellingPrice(): float
    {
        return $this->unit_selling_price;
    }

    public function toArray(): array
    {
        return [
            'product_id' => $this->product_id,
            'qty' => $this->qty,
            'unit_selling_price' => $this->unit_selling_price,
        ];
    }
}
