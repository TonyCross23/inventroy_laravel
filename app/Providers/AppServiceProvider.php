<?php

namespace App\Providers;

use App\Interfaces\Services\ProductServiceInterface;
use App\Interfaces\Services\PurchaseServiceInterface;
use App\Interfaces\Services\SaleServiceInterface;
use App\Services\ProductService;
use App\Services\PurchaseService;
use App\Services\SaleService;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind( ProductServiceInterface::class, ProductService::class);

        $this->app->bind(PurchaseServiceInterface::class, PurchaseService::class);

        $this->app->bind( SaleServiceInterface::class, SaleService::class
    );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
