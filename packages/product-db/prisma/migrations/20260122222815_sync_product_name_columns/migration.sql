-- Backfill existing rows with product names
UPDATE "ProductCategory" pc
SET "name" = p."name"
FROM "Product" p
WHERE pc."productId" = p."id" AND pc."name" IS NULL;

UPDATE "ProductSpecification" ps
SET "name" = p."name"
FROM "Product" p
WHERE ps."productId" = p."id" AND ps."name" IS NULL;

-- Function to sync ProductCategory.name on insert/update of productId
CREATE OR REPLACE FUNCTION sync_productcategory_name()
RETURNS TRIGGER AS $$
BEGIN
	SELECT "name" INTO NEW."name" FROM "Product" WHERE "id" = NEW."productId";
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for ProductCategory BEFORE INSERT or UPDATE OF productId
DROP TRIGGER IF EXISTS trg_productcategory_sync_name ON "ProductCategory";
CREATE TRIGGER trg_productcategory_sync_name
BEFORE INSERT OR UPDATE OF "productId" ON "ProductCategory"
FOR EACH ROW
EXECUTE FUNCTION sync_productcategory_name();

-- Function to sync ProductSpecification.name on insert/update of productId
CREATE OR REPLACE FUNCTION sync_productspecification_name()
RETURNS TRIGGER AS $$
BEGIN
	SELECT "name" INTO NEW."name" FROM "Product" WHERE "id" = NEW."productId";
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for ProductSpecification BEFORE INSERT or UPDATE OF productId
DROP TRIGGER IF EXISTS trg_productspecification_sync_name ON "ProductSpecification";
CREATE TRIGGER trg_productspecification_sync_name
BEFORE INSERT OR UPDATE OF "productId" ON "ProductSpecification"
FOR EACH ROW
EXECUTE FUNCTION sync_productspecification_name();

-- Cascade updates: when Product.name changes, update dependent tables
CREATE OR REPLACE FUNCTION cascade_product_name_update()
RETURNS TRIGGER AS $$
BEGIN
	IF NEW."name" IS DISTINCT FROM OLD."name" THEN
		UPDATE "ProductCategory" SET "name" = NEW."name" WHERE "productId" = NEW."id";
		UPDATE "ProductSpecification" SET "name" = NEW."name" WHERE "productId" = NEW."id";
	END IF;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_product_name_cascade ON "Product";
CREATE TRIGGER trg_product_name_cascade
AFTER UPDATE OF "name" ON "Product"
FOR EACH ROW
EXECUTE FUNCTION cascade_product_name_update();
