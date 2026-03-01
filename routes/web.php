<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SaleController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('products', ProductController::class);
    Route::get('/sales/export', [SaleController::class, 'export'])->name('sales.export');
    Route::resource('sales', SaleController::class);
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/purchases', [PurchaseController::class, 'index']);
    Route::post('/purchases', [PurchaseController::class, 'store']);
    Route::get('/purchases/export', [PurchaseController::class, 'export']);
    Route::delete('/purchases/{purchase}', [PurchaseController::class, 'destroy']);
});

require __DIR__ . '/settings.php';
