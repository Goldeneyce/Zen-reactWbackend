// components/blog/RelatedProducts.tsx
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity/image";
import type { RelatedProduct } from "@/lib/sanity/types";

interface RelatedProductsProps {
  products: RelatedProduct[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-gray/20">
      <h2 className="text-2xl font-bold text-dark dark:text-dark-light mb-6">
        Related Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            key={product._id}
            href={product.slug ? `/products/${product.slug.current}` : "#"}
            className="group bg-white dark:bg-white-dark rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            {/* Product image */}
            <div className="relative h-44 w-full overflow-hidden bg-gray/5">
              {product.image ? (
                <Image
                  src={urlFor(product.image).width(400).height(300).url()}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray text-sm">
                  No image
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="p-4">
              <h3 className="font-semibold text-dark dark:text-dark-light group-hover:text-secondary transition-colors line-clamp-1">
                {product.title}
              </h3>
              {product.price != null && (
                <p className="text-secondary font-bold mt-1">
                  ₦{product.price.toLocaleString()}
                </p>
              )}
              {product.description && (
                <p className="text-gray text-sm mt-1 line-clamp-2">
                  {product.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
