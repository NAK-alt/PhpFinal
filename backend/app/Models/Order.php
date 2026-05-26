<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = ['user_id', 'recipient_name', 'phone', 'address_line1', 'address_line2', 'city', 'postal_code', 'country', 'total_amount', 'tax_amount', 'status'];
    protected $casts    = ['total_amount' => 'float', 'tax_amount' => 'float'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
