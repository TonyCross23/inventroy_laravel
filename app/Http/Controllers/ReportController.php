<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use Inertia\Inertia;
use App\Exports\ProfitReportExport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ReportController extends Controller
{
    private function getReportData($range = '7days')
    {
        $query = Sale::with('product');

        if ($range === 'today') {
            $query->whereDate('created_at', Carbon::today());
        } elseif ($range === '7days') {
            $query->where('created_at', '>=', Carbon::now()->subDays(7));
        } elseif ($range === '30days') {
            $query->where('created_at', '>=', Carbon::now()->subDays(30));
        } elseif ($range === 'year') {
            $query->where('created_at', '>=', Carbon::now()->subYear());
        }

        return $query->latest()
            ->get()
            ->map(function ($sale) {
                $profit = ($sale->unit_selling_price - $sale->product->buying_price) * $sale->qty;
                return [
                    'id' => $sale->id,
                    'product_name' => $sale->product->name,
                    'qty' => $sale->qty,
                    'selling_price' => $sale->unit_selling_price,
                    'buying_price' => $sale->product->buying_price,
                    'profit' => $profit,
                    'date' => $sale->created_at->format('Y-m-d'),
                ];
            });
    }

    public function index(Request $request)
    {
        $range = $request->input('range', '7days'); // default က ၇ ရက်စာ
        $salesReport = $this->getReportData($range);

        $totalProfit = $salesReport->sum('profit');
        $totalRevenue = $salesReport->sum(fn($s) => $s['selling_price'] * $s['qty']);

        return Inertia::render('Reports/Index', [
            'reports' => $salesReport,
            'summary' => [
                'total_profit' => $totalProfit,
                'total_revenue' => $totalRevenue,
            ],
            'filters' => [
                'range' => $range
            ]
        ]);
    }

    public function export(Request $request)
    {
        $range = $request->input('range', '7days');
        $reports = $this->getReportData($range);
        return Excel::download(new ProfitReportExport($reports), "profit-report-{$range}.xlsx");
    }
}
