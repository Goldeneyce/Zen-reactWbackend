-- AlterTable: Add categoryName column
ALTER TABLE "ProductCategory" ADD COLUMN "categoryName" TEXT;

-- Backfill existing rows with category names
UPDATE "ProductCategory" pc
SET "categoryName" = c."name"
FROM "Category" c
WHERE pc."categoryId" = c."id" AND pc."categoryName" IS NULL;

-- Make categoryName NOT NULL after backfill
ALTER TABLE "ProductCategory" ALTER COLUMN "categoryName" SET NOT NULL;

-- Function to sync ProductCategory.categoryName on insert/update of categoryId
CREATE OR REPLACE FUNCTION sync_productcategory_categoryname()
RETURNS TRIGGER AS $$
BEGIN
  SELECT "name" INTO NEW."categoryName" FROM "Category" WHERE "id" = NEW."categoryId";
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for ProductCategory BEFORE INSERT or UPDATE OF categoryId
DROP TRIGGER IF EXISTS trg_productcategory_sync_categoryname ON "ProductCategory";
CREATE TRIGGER trg_productcategory_sync_categoryname
BEFORE INSERT OR UPDATE OF "categoryId" ON "ProductCategory"
FOR EACH ROW
EXECUTE FUNCTION sync_productcategory_categoryname();

-- Cascade updates: when Category.name changes, update ProductCategory.categoryName
CREATE OR REPLACE FUNCTION cascade_category_name_update()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW."name" IS DISTINCT FROM OLD."name" THEN
    UPDATE "ProductCategory" SET "categoryName" = NEW."name" WHERE "categoryId" = NEW."id";
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_category_name_cascade ON "Category";
CREATE TRIGGER trg_category_name_cascade
AFTER UPDATE OF "name" ON "Category"
FOR EACH ROW
EXECUTE FUNCTION cascade_category_name_update();

