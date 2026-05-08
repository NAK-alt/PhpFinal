<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['name','brand','price','image','description','category','stock','is_active'];
    protected $casts    = ['price' => 'float', 'stock' => 'integer', 'is_active' => 'boolean'];

    public function features() { return $this->hasMany(ProductFeature::class); }
}
