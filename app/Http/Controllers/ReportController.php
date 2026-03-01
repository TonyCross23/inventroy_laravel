<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index()
    {
        // အရောင်းတစ်ခုချင်းစီရဲ့ အမြတ်ကို တွက်ချက်ခြင်း
        $salesReport = Sale::with('product')
            ->latest()
            ->get()
            ->map(function ($sale) {
                // အမြတ် = (ရောင်းစျေး - ဝယ်ရင်းစျေး) * အရေအတွက်
                $profit = ($sale->unit_selling_price - $sale->product->buying_price) * $sale->qty;

                return [
                    'id' => $sale->id,
                    'product_name' => $sale->product->name,
                    'qty' => $sale->qty,
                    'selling_price' => $sale->unit_selling_price,
                    'buying_price' => $sale->product->buying_price, // ဒါက Purchases ကနေ Product ထဲ ရောက်လာတဲ့စျေး
                    'profit' => $profit,
                    'date' => $sale->created_at->format('Y-m-d'),
                ];
            });

        // စုစုပေါင်း အမြတ် (Total Profit)
        $totalProfit = $salesReport->sum('profit');
        $totalRevenue = $salesReport->sum(fn($s) => $s['selling_price'] * $s['qty']);

        return Inertia::render('Reports/Index', [
            'reports' => $salesReport,
            'summary' => [
                'total_profit' => $totalProfit,
                'total_revenue' => $totalRevenue,
            ]
        ]);
    }
}
