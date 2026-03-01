<?php

namespace App\Exports;

use App\Models\Sale;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class SalesExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        // အရောင်းမှတ်တမ်းတွေကို product name ပါ တစ်ခါတည်း ဆွဲထုတ်မယ်
        return Sale::with('product')->latest()->get();
    }

    public function headings(): array
    {
        return [
            'ရက်စွဲ',
            'ပစ္စည်းအမည်',
            'အရေအတွက်',
            'ရောင်းစျေး (Unit)',
            'စုစုပေါင်း ရောင်းရငွေ',
        ];
    }

    public function map($sale): array
    {
        return [
            $sale->created_at->format('Y-m-d'),
            $sale->product->name,
            $sale->qty,
            number_format($sale->unit_selling_price),
            number_format($sale->qty * $sale->unit_selling_price),
        ];
    }
}
