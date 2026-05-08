# Chronos Luxury — Full Stack App

**React + Vite** frontend · **Laravel 12** API backend · **MySQL** via Laragon

---

## ⚡ Quick Start (Windows + Laragon)

### Prerequisites
Make sure Laragon is installed and **MySQL is running**. You also need:
- PHP 8.2+ (included with Laragon)
- Composer (https://getcomposer.org)
- Node.js 18+ (https://nodejs.org)

### Option A — One-click setup
Double-click `setup.bat` and it will do everything automatically.

### Option B — Manual setup

#### 1. Create the database
Open Laragon → click **Database** (HeidiSQL opens)  
Create a new database named: `chronos_luxury`

#### 2. Backend (Laravel)
```bash
cd backend

# Install PHP dependencies
composer install

# Copy environment file
copy .env.example .env        # Windows
# OR
cp .env.example .env          # Mac/Linux

# Generate app key
php artisan key:generate

# Run migrations + seed data
php artisan migrate:fresh --seed

# Start the API server
php artisan serve --port=8000
```

#### 3. Frontend (React)
Open a **second terminal**:
```bash
cd frontend

npm install
npm run dev
```

#### 4. Open the app
- **Frontend**: http://localhost:5173
- **API**: http://localhost:8000/api

---

## 🔑 Demo Credentials

| Role     | Email                  | Password   |
|----------|------------------------|------------|
| Admin    | admin@chronos.com      | password   |
| Customer | user@chronos.com       | password   |

---

## 📁 Project Structure

```
chronos-fullstack/
├── setup.bat                  ← one-click Windows setup
├── frontend/                  ← React + Vite app
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── index.css
│   │   ├── lib/
│   │   │   ├── api.ts         ← Axios instance (points to :8000)
│   │   │   └── utils.ts
│   │   ├── context/
│   │   │   ├── AuthContext.tsx ← login/logout/register state
│   │   │   └── CartContext.tsx ← cart with API sync
│   │   └── components/
│   │       ├── Layout.tsx
│   │       ├── Navbar.tsx
│   │       ├── Footer.tsx
│   │       ├── WatchCard.tsx
│   │       ├── ui/            ← shadcn/ui components
│   │       └── pages/
│   │           ├── Home.tsx
│   │           ├── Products.tsx
│   │           ├── ProductDetail.tsx
│   │           ├── Cart.tsx
│   │           ├── About.tsx
│   │           ├── Contact.tsx
│   │           ├── Login.tsx
│   │           ├── Register.tsx
│   │           └── AdminDashboard.tsx
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
└── backend/                   ← Laravel 12 API
    ├── .env.example           ← copy to .env before setup
    ├── composer.json
    ├── bootstrap/app.php      ← CORS + middleware registration
    ├── routes/
    │   ├── api.php            ← all API routes
    │   └── web.php
    ├── app/
    │   ├── Http/
    │   │   ├── Controllers/
    │   │   │   ├── Auth/AuthController.php
    │   │   │   ├── Admin/
    │   │   │   │   ├── AdminProductController.php
    │   │   │   │   ├── AdminContactController.php
    │   │   │   │   └── AdminStatsController.php
    │   │   │   ├── ProductController.php
    │   │   │   ├── CartController.php
    │   │   │   ├── OrderController.php
    │   │   │   └── ContactController.php
    │   │   └── Middleware/
    │   │       └── IsAdmin.php
    │   ├── Models/
    │   │   ├── User.php
    │   │   ├── Role.php
    │   │   ├── Product.php
    │   │   ├── ProductFeature.php
    │   │   ├── Cart.php
    │   │   ├── CartItem.php
    │   │   ├── Order.php
    │   │   ├── OrderItem.php
    │   │   └── ContactMessage.php
    │   └── Policies/
    │       └── CartItemPolicy.php
    ├── database/
    │   ├── migrations/        ← 10 migration files
    │   └── seeders/
    │       ├── DatabaseSeeder.php
    │       ├── RoleSeeder.php
    │       ├── AdminSeeder.php
    │       └── ProductSeeder.php (8 luxury watches pre-loaded)
    └── config/
        ├── cors.php           ← allows localhost:5173
        └── sanctum.php

```

---

## 🔌 API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Create account |
| POST | `/api/login` | Login → returns Bearer token |
| GET | `/api/products` | List products (search, filter, sort) |
| GET | `/api/products/{id}` | Product detail with features |
| POST | `/api/contact` | Submit contact form |

### Authenticated (Bearer token required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/logout` | Logout |
| GET | `/api/user` | Current user info |
| GET | `/api/cart` | Get cart |
| POST | `/api/cart` | Add item to cart |
| PUT | `/api/cart/{id}` | Update item quantity |
| DELETE | `/api/cart/{id}` | Remove item |
| POST | `/api/orders` | Checkout (cart → order) |
| GET | `/api/orders` | Order history |

### Admin only (`role_id = 1`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard stats |
| GET/POST/PUT/DELETE | `/api/admin/products` | Full product CRUD |
| GET | `/api/admin/contacts` | View all messages |
| PUT | `/api/admin/contacts/{id}/read` | Mark message read |

---

## 🗄️ Database Tables
`roles` · `users` · `personal_access_tokens` · `products` · `product_features` · `carts` · `cart_items` · `orders` · `order_items` · `contact_messages`

---

## 🛠️ Common Issues

**"Access-Control-Allow-Origin" CORS error**
→ Make sure Laravel is on port 8000 and React on port 5173. Check `backend/.env` has `SANCTUM_STATEFUL_DOMAINS=localhost:5173`

**"Class not found" errors in Laravel**
→ Run `composer dump-autoload` inside the `backend/` folder

**Migration fails / DB connection refused**
→ Open Laragon and start MySQL. Confirm `DB_DATABASE=chronos_luxury` exists in HeidiSQL

**Blank page in React**
→ Check browser console. Usually a missing `npm install` or API call failing because Laravel isn't running

---

## 🎨 Features
- ✅ Luxury watch e-commerce storefront
- ✅ JWT-style auth via Laravel Sanctum tokens
- ✅ Admin & Customer roles with protected routes
- ✅ Full product CRUD from Admin dashboard
- ✅ Persistent cart synced to database when logged in
- ✅ Contact form with admin inbox
- ✅ Live search + filter + sort on products
- ✅ Dark / light mode toggle
- ✅ Fully responsive mobile layout
- ✅ 8 luxury watches pre-seeded with features
# PhpFinal
