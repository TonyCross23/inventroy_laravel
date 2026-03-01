<?php

namespace App\Interfaces\DTOs;

interface SaleDTOInterface
{
    public function getProductId(): int;
    public function getQty(): int;
    public function getUnitSellingPrice(): float;
    public function toArray(): array;
}
