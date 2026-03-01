<?php

namespace App\DTOs;

use App\Interfaces\DTOs\ProductDTOInterface;

readonly class ProductDTO implements ProductDTOInterface
{
    public function __construct(
        private string $name,
        private int $stock,
        private float $buying_price
    ) {}

    public function getName(): string
    {
        return $this->name;
    }
    public function getStock(): int
    {
        return $this->stock;
    }
    public function getBuyingPrice(): float
    {
        return $this->buying_price;
    }

    public function toArray(): array
    {
        $data = [
            'name' => $this->name,
            'stock' => $this->stock,
            'buying_price' => $this->buying_price,
        ];

        return $data;
    }
}
