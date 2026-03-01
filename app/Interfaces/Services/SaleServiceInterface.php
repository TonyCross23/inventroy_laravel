<?php

namespace App\Interfaces\Services;

use App\Interfaces\DTOs\SaleDTOInterface;
use App\Models\Sale;

interface SaleServiceInterface
{
    public function getAllSales(string $search = '');
    public function storeSale(SaleDTOInterface $dto): Sale;
    public function deleteSale(Sale $sale): bool;
}
