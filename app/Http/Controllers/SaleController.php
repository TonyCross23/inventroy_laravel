<?php

namespace App\Http\Controllers;

use App\Models\{Sale, Product};
use App\DTOs\SaleDTO;
use App\Exports\SalesExport;
use App\Interfaces\Services\SaleServiceInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class SaleController extends Controller
{
    public function __construct(protected SaleServiceInterface $service) {}

    public function index(Request $request)
    {
        return Inertia::render('Sales/Index', [
            'sales' => $this->service->getAllSales($request->input('search', '')),
            'products' => Product::where('stock', '>', 0)->get(['id', 'name', 'stock']),
            'filters' => ['search' => $request->input('search', '')]
        ]);
    }

    public function export()
    {
        return Excel::download(new SalesExport, 'sales.xlsx');
    }

    public function store(Request $request)
    {
        $product = Product::findOrFail($request->product_id);

        $valid = $request->validate([
            'product_id' => 'required|exists:products,id',
            'qty' => "required|integer|min:1|max:{$product->stock}",
            'unit_selling_price' => 'required|numeric|min:0',
        ], [
            'qty.max' => "အရောင်းပမာဏသည် ပစ္စည်း၏ လက်ကျန်ပမာဏထက် မပိုနိုင်ပါ။ (လက်ကျန်: {$product->stock})",
        ]);

        $this->service->storeSale(new SaleDTO(...$valid));
        return redirect()->back()->with('success', 'အရောင်းမှတ်တမ်း သိမ်းဆည်းပြီးပါပြီ။');
    }

    public function destroy(Sale $sale)
    {
        $this->service->deleteSale($sale);
        return redirect()->back()->with('success', 'အရောင်းမှတ်တမ်း ဖျက်သိမ်းပြီးပါပြီ။');
    }
}
