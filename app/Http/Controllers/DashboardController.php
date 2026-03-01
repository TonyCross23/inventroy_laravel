<?php

namespace App\Http\Controllers;

use App\Models\{Sale, Product};
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // filter parameter ကိုယူမယ် (default က 7days)
        $range = $request->input('range', '7days');
        $startDate = match ($range) {
            '30days' => now()->subDays(30),
            'year' => now()->startOfYear(),
            default => now()->subDays(6),
        };

        // ၁။ အခြေခံ Stats (ဒီနေ့အတွက်သာ)
        $todaySales = Sale::whereDate('created_at', Carbon::today())->get();
        $stats = [
            'total_revenue' => $todaySales->sum(fn($s) => $s->qty * $s->unit_selling_price),
            'total_profit' => $todaySales->sum(fn($s) => ($s->unit_selling_price - $s->product->buying_price) * $s->qty),
            'low_stock' => Product::where('stock', '<', 5)->count(),
            'total_products' => Product::count(),
        ];

        // ၂။ အရောင်း Chart (ရွေးချယ်ထားတဲ့ ကာလအလိုက်)
        $salesChart = Sale::select(
            DB::raw($range === 'year' ? 'MONTHNAME(created_at) as name' : 'DATE(created_at) as name'),
            DB::raw('SUM(qty * unit_selling_price) as amount')
        )
            ->where('created_at', '>=', $startDate)
            ->groupBy('name')
            ->orderBy('name')
            ->get();

        // ၃။ ရောင်းအားအကောင်းဆုံး ၅ မျိုး
        $topProducts = Sale::with('product')
            ->select('product_id', DB::raw('SUM(qty) as qty'))
            ->groupBy('product_id')
            ->orderBy('qty', 'desc')
            ->take(5)
            ->get()
            ->map(fn($item) => [
                'name' => $item->product->name,
                'qty' => (int) $item->qty
            ]);

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'salesChart' => $salesChart,
            'topProducts' => $topProducts,
            'filters' => ['range' => $range]
        ]);
    }
}
