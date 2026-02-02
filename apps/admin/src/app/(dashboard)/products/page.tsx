export const dynamic = 'force-dynamic';
import { ProductsType } from "@repo/types";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const getData = async (): Promise<ProductsType> => {
  try {
    const response = await fetch("http://localhost:8000/products?limit=100", {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to fetch products");
    type ApiProduct = {
      id: string | number;
      name: string;
      description?: string;
      price: number;
      categories?: ProductsType[number]["categories"];
    };

    const products: ApiProduct[] = await response.json();
    return products.map((product) => ({
      id: product.id,
      name: product.name,
      shortDescription: product.description?.substring(0, 100) || "",
      description: product.description || "",
      price: product.price,
      categories: product.categories,
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

const ProductPage = async () => {
  const data = await getData();
  return (
    <div className="">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">All Products</h1>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default ProductPage;
