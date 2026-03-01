<?php

namespace App\Exports;

use App\Models\Purchase;
use Maatwebsite\Excel\Concerns\{FromCollection, WithHeadings, WithMapping};

class PurchasesExport implements FromCollection, WithHeadings, WithMapping 
{
    public function collection() 
    { 
        return Purchase::with('product')->latest()->get(); 
    }

    public function headings(): array 
    { 
        return [
            'ဝယ်ယူသည့်ရက်စွဲ',
            'ပစ္စည်းအမည်',
            'အရေအတွက်',
            'တစ်ခုချင်းစျေး (Unit Price)',
            'စုစုပေါင်းကျသင့်ငွေ',
        ]; 
    }

    public function map($p): array 
    {
        return [
            $p->created_at->format('Y-m-d'), 
            $p->product->name,               
            $p->qty,                         
            number_format($p->unit_purchase_price),
            number_format($p->qty * $p->unit_purchase_price)
        ];
    }
}