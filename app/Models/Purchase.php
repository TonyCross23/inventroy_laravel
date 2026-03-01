<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    protected $fillable = ['product_id', 'qty', 'unit_purchase_price'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
