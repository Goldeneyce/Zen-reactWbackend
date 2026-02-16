/*
  Warnings:

  - Made the column `name` on table `ProductCategory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `ProductSpecification` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ProductCategory" ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProductSpecification" ALTER COLUMN "name" SET NOT NULL;

-- CreateIndex
CREATE INDEX "ProductCategory_productId_idx" ON "ProductCategory"("productId");

-- CreateIndex
CREATE INDEX "ProductSpecification_productId_idx" ON "ProductSpecification"("productId");
