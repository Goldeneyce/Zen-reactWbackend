# Category Feature Implementation

## Overview
This update adds a new `Category` model to the database schema and relates it to the `Product` model.

## Database Changes

### New Model: Category
```prisma
model Category {
  id       Int       @id @default(autoincrement())
  name     String
  slug     String    @unique
  products Product[]
}
```

### Updated Product Model
Added the following fields to establish the relationship:
- `categorySlug String` - Foreign key to Category
- `categoryModel Category @relation(fields: [categorySlug], references: [slug])` - Relation field

## Backend Changes

### New Files
1. **apps/product-service/src/controllers/category.controller.ts**
   - CRUD operations for categories
   - Slug generation and validation
   - Product count tracking

2. **apps/product-service/src/routes/category.route.ts**
   - Routes for category management:
     - `POST /categories` - Create category
     - `GET /categories` - List categories
     - `GET /categories/slug/:slug` - Get category by slug
     - `GET /categories/:id` - Get category by ID
     - `PUT /categories/:id` - Update category
     - `DELETE /categories/:id` - Delete category

3. **packages/product-db/seed.ts**
   - Seeds initial categories matching ProductCategory enum

### Updated Files
1. **apps/product-service/src/index.ts**
   - Added category routes

2. **apps/product-service/src/controllers/product.controller.ts**
   - All product queries now include `categoryModel` relation

## Frontend Changes

### Updated Files
1. **apps/client/src/types.ts**
   - Added `Category` interface
   - Updated `Product` interface with `categorySlug` and `categoryModel` fields

2. **apps/admin/src/components/AddCategory.tsx**
   - Added form submission logic
   - Added slug field (optional)
   - Connects to backend API

## Setup Instructions

### 1. Install Dependencies
```bash
cd packages/product-db
pnpm install
```

### 2. Generate Prisma Client
```bash
cd packages/product-db
pnpm db:generate
```

### 3. Run Migration (if database is running)
```bash
cd packages/product-db
pnpm db:migrate
```

### 4. Seed Categories (after migration)
```bash
cd packages/product-db
pnpm db:seed
```

### 5. Update Existing Products
After seeding categories, you'll need to update existing products to have a `categorySlug`. You can do this via the API or directly in the database.

Example API call to update a product:
```bash
curl -X PUT http://localhost:8000/products/{productId} \
  -H "Content-Type: application/json" \
  -d '{"categorySlug": "entertainment"}'
```

## API Usage Examples

### Create a Category
```bash
curl -X POST http://localhost:8000/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "New Category", "slug": "new-category"}'
```

### Get All Categories
```bash
curl http://localhost:8000/categories
```

### Get Category with Products
```bash
curl http://localhost:8000/categories/slug/entertainment
```

### Create Product with Category
```bash
curl -X POST http://localhost:8000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Product Name",
    "description": "Product Description",
    "price": 99.99,
    "category": "entertainment",
    "categorySlug": "entertainment",
    "image": "/path/to/image.jpg",
    "rating": 4.5,
    "reviews": 10,
    "features": ["Feature 1"],
    "inStock": true
  }'
```

## Notes
- The `categorySlug` field is required when creating or updating products
- Categories must exist before assigning them to products
- The old `category` enum field is kept for backward compatibility
- All product API responses now include the related `categoryModel` data
