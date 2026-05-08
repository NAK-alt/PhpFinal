<?php
namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $fillable = ['name', 'email', 'password', 'role_id'];
    protected $hidden   = ['password', 'remember_token'];
    protected $casts    = ['email_verified_at' => 'datetime', 'password' => 'hashed'];

    public function role()   { return $this->belongsTo(Role::class); }
    public function cart()   { return $this->hasOne(Cart::class); }
    public function orders() { return $this->hasMany(Order::class); }
    public function isAdmin(): bool { return $this->role?->name === 'admin'; }
}
