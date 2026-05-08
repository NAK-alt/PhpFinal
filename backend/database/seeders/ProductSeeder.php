<?php
namespace Database\Seeders;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $watches = [
            [
                'name' => 'Submariner Classic', 'brand' => 'Oceanus', 'price' => 8500, 'category' => 'diving', 'stock' => 8,
                'image' => 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80',
                'description' => 'A timeless diving watch with exceptional water resistance and precision engineering.',
                'features' => ['Water resistant to 300m', 'Automatic movement', 'Ceramic bezel', 'Luminous markers', 'Oyster bracelet'],
            ],
            [
                'name' => 'Royal Heritage', 'brand' => 'Majesty', 'price' => 12800, 'category' => 'dress', 'stock' => 5,
                'image' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
                'description' => 'An elegant dress watch featuring gold accents and finest Swiss craftsmanship.',
                'features' => ['18k gold case', 'Swiss movement', 'Sapphire crystal', 'Alligator leather strap'],
            ],
            [
                'name' => 'Speedmaster Pro', 'brand' => 'Velocity', 'price' => 6200, 'category' => 'sport', 'stock' => 12,
                'image' => 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=600&q=80',
                'description' => 'Professional chronograph with racing heritage and precise timing capabilities.',
                'features' => ['Chronograph function', 'Tachymeter scale', 'Manual wind', 'Steel bracelet'],
            ],
            [
                'name' => 'Explorer Elite', 'brand' => 'Adventure', 'price' => 7800, 'category' => 'sport', 'stock' => 7,
                'image' => 'https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=600&q=80',
                'description' => 'Built for adventure with rugged design and superior durability in any condition.',
                'features' => ['Shock resistant', 'GMT function', 'Titanium case', 'Anti-magnetic'],
            ],
            [
                'name' => 'Constellation Luxury', 'brand' => 'Stellar', 'price' => 15600, 'category' => 'luxury', 'stock' => 3,
                'image' => 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=600&q=80',
                'description' => 'The epitome of luxury with diamond hour markers and the finest precious metals.',
                'features' => ['Diamond hour markers', 'Platinum case', 'Co-axial escapement', 'Alligator strap'],
            ],
            [
                'name' => 'Diver Master', 'brand' => 'DeepSea', 'price' => 4200, 'category' => 'diving', 'stock' => 15,
                'image' => 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&q=80',
                'description' => 'Professional diving watch with helium escape valve and deep-sea capabilities.',
                'features' => ['Water resistant to 500m', 'Helium escape valve', 'Unidirectional bezel', 'Super-LumiNova'],
            ],
            [
                'name' => 'Datejust Classic', 'brand' => 'Prestige', 'price' => 9400, 'category' => 'dress', 'stock' => 6,
                'image' => 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600&q=80',
                'description' => 'A classic dress watch that has graced the wrists of royalty and heads of state.',
                'features' => ['Date display', 'Jubilee bracelet', 'Cyclops lens', 'Self-winding'],
            ],
            [
                'name' => 'Pilot Chronograph', 'brand' => 'AeroTime', 'price' => 5900, 'category' => 'sport', 'stock' => 9,
                'image' => 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80',
                'description' => 'Aviation-inspired chronograph with exceptional legibility and precise functionality.',
                'features' => ['Slide rule bezel', 'Flyback chronograph', 'Anti-reflective crystal', 'NATO strap included'],
            ],
        ];

        foreach ($watches as $data) {
            $features = $data['features'];
            unset($data['features']);
            $product = Product::firstOrCreate(['name' => $data['name'], 'brand' => $data['brand']], $data);
            if ($product->wasRecentlyCreated) {
                foreach ($features as $f) {
                    $product->features()->create(['feature' => $f]);
                }
            }
        }
    }
}
