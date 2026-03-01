<?php

namespace App\Interfaces\DTOs;

interface ProductDTOInterface
{
    public function getName(): string;
    public function getStock(): int;
    public function getBuyingPrice(): float;
    public function toArray(): array;
}
