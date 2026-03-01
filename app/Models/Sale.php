<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    protected $fillable = ['product_id', 'qty', 'unit_selling_price'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
