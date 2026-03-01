<?php

namespace App\Http\Controllers;

use App\Models\{Purchase, Product};
use App\DTOs\PurchaseDTO;
use App\Interfaces\Services\PurchaseServiceInterface;
use App\Exports\PurchasesExport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    public function __construct(protected PurchaseServiceInterface $service) {}

    public function index(Request $request)
    {
        return Inertia::render('Purchases/Index', [
            'purchases' => $this->service->getAllPurchases($request->input('search', '')),
            'products' => Product::all(['id', 'name']),
            'filters' => ['search' => $request->input('search', '')]
        ]);
    }

    public function store(Request $request)
    {
        $valid = $request->validate([
            'product_id' => 'required|exists:products,id',
            'qty' => 'required|integer|min:1',
            'total_amount' => 'required|numeric|min:0',
        ]);
        $calculatedUnitPrice = $valid['total_amount'] / $valid['qty'];
        
        $dto = new PurchaseDTO(
            (int) $valid['product_id'],
            (int) $valid['qty'],
            (float) $calculatedUnitPrice
        );

        $this->service->storePurchase($dto);
        return redirect()->back()->with('success', 'အဝယ်မှတ်တမ်း သိမ်းဆည်းပြီးပါပြီ။');
    }

    public function export()
    {
        return Excel::download(new PurchasesExport, 'purchases.xlsx');
    }

    public function destroy(Purchase $purchase)
    {
        $this->service->deletePurchase($purchase);
        return redirect()->back()->with('success', 'ဖျက်သိမ်းပြီးပါပြီ။');
    }
}
