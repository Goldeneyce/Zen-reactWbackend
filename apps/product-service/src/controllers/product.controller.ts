import type { Context } from "hono";
import { prisma, Prisma } from "@repo/product-db";
import { producer } from "../utils/kafka.ts";
import { ProductType } from "@repo/types";

const slugify = (value: string) =>
	value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "") || "product";

const ensureUniqueSlug = async (base: string, currentId?: string) => {
	let candidate = base;
	let suffix = 1;

	while (true) {
		const existing = await prisma.product.findFirst({
			where: {
				slug: candidate,
				...(currentId ? { id: { not: currentId } } : {}),
			},
		});

		if (!existing) return candidate;
		candidate = `${base}-${suffix++}`;
	}
};

export const createProduct = async (c: Context) => {
	const body = (await c.req.json()) as Prisma.ProductCreateInput & { slug?: string };
	const baseSlug = body.slug ? slugify(body.slug) : slugify(body.name);
	const slug = await ensureUniqueSlug(baseSlug);

	// Extract categories if provided as an array of ids
	let categoriesData: Prisma.ProductCategoryCreateNestedManyWithoutProductInput | {} = {};
	if (Array.isArray(body.categories)) {
		// Resolve category names for denormalized fields
		const categoryIds = body.categories.map((cat: any) => cat.id || cat);
		const categories = await prisma.category.findMany({ where: { id: { in: categoryIds.map(Number) } } });
		const categoryMap = new Map(categories.map((cat) => [cat.id, cat]));

		categoriesData = {
			create: body.categories.map((cat: any) => {
				const catId = cat.id || cat;
				const resolved = categoryMap.get(Number(catId));
				return {
					category: { connect: { id: Number(catId) } },
					name: resolved?.name ?? "",
					categoryName: resolved?.name ?? "",
				};
			}),
		};
	} else if (body.categories) {
		categoriesData = body.categories;
	}

	const product = await prisma.product.create({
		data: {
			name: body.name,
			description: body.description,
			price: body.price,
			originalPrice: body.originalPrice,
			image: body.image,
			images: body.images,
			sizes: body.sizes ?? [],
			colors: body.colors ?? [],
			rating: body.rating,
			reviews: body.reviews,
			features: body.features,
			inStock: body.inStock,
			payOnDelivery: body.payOnDelivery ?? false,
			badge: body.badge,
			weight: body.weight ?? undefined,
			length: body.length ?? undefined,
			width: body.width ?? undefined,
			height: body.height ?? undefined,
			slug,
			categories: categoriesData as any,
			...(body.specifications && { specifications: body.specifications }),
		},
		include: {
			categories: {
				include: {
					category: true,
				},
			},
			specifications: true,
		},
	});

	const productEvent: ProductType = product;
	producer.send("product.created", { value: JSON.stringify(productEvent) });
	return c.json(product, 201);
};

export const getProducts = async (c: Context) => {
	const { search, limit, category, sort } = c.req.query();

	// Validate search parameter
	let validatedSearch: string | undefined;
	if (search) {
		if (typeof search !== "string") {
			return c.json({ error: "Search parameter must be a string" }, 400);
		}
		if (search.length > 100) {
			return c.json({ error: "Search parameter must be 100 characters or less" }, 400);
		}
		validatedSearch = search.trim();
	}

	// Validate category parameter
	let validatedCategory: string | undefined;
	if (category) {
		if (typeof category !== "string") {
			return c.json({ error: "Category parameter must be a string" }, 400);
		}
		validatedCategory = category.trim();
	}

	// Validate limit parameter
	const MAX_LIMIT = 100;
	const DEFAULT_LIMIT = 50;
	let validatedLimit: number | undefined;

	if (limit) {
		if (typeof limit !== "string" || isNaN(Number(limit))) {
			return c.json({ error: "Limit parameter must be a valid number" }, 400);
		}
		const parsedLimit = parseInt(limit, 10);
		if (parsedLimit < 1) {
			return c.json({ error: "Limit must be at least 1" }, 400);
		}
		if (parsedLimit > MAX_LIMIT) {
			return c.json({ error: `Limit cannot exceed ${MAX_LIMIT}` }, 400);
		}
		validatedLimit = parsedLimit;
	} else {
		validatedLimit = DEFAULT_LIMIT;
	}

	// Validate and set sort parameter
	type SortOption = 'newest' | 'oldest' | 'price-asc' | 'price-desc';
	const validSortOptions: SortOption[] = ['newest', 'oldest', 'price-asc', 'price-desc'];
	let validatedSort: SortOption = 'newest'; // Default sort

	if (sort) {
		if (typeof sort !== "string") {
			return c.json({ error: "Sort parameter must be a string" }, 400);
		}
		if (validSortOptions.includes(sort as SortOption)) {
			validatedSort = sort as SortOption;
		} else {
			return c.json({ 
				error: `Invalid sort option. Must be one of: ${validSortOptions.join(', ')}` 
			}, 400);
		}
	}

	// Build orderBy based on sort option
	let orderBy: any = {};
	switch (validatedSort) {
		case 'newest':
			orderBy = { createdAt: 'desc' };
			break;
		case 'oldest':
			orderBy = { createdAt: 'asc' };
			break;
		case 'price-asc':
			orderBy = { price: 'asc' };
			break;
		case 'price-desc':
			orderBy = { price: 'desc' };
			break;
		default:
			orderBy = { createdAt: 'desc' };
	}

	const products = await prisma.product.findMany({
		where: {
			...(validatedSearch ? { name: { contains: validatedSearch, mode: "insensitive" } } : {}),
			...(validatedCategory && validatedCategory !== "all"
				? {
						categories: {
							some: {
								category: {
									slug: validatedCategory,
								},
							},
						},
				  }
				: {}),
		},
		orderBy,
		take: validatedLimit,
		include: {
			categories: {
				include: {
					category: true,
				},
			},
		},
	});
	return c.json(products, 200);
};

export const getProduct = async (c: Context) => {
	const id = c.req.param("id");
	const product = await prisma.product.findUnique({
		where: { id },
		include: {
			categories: {
				include: {
					category: true,
				},
			},
			specifications: true,
		},
	});

	if (!product) {
		return c.json({ error: "Product not found" }, 404);
	}

	return c.json(product, 200);
};

export const getProductBySlug = async (c: Context) => {
	const slug = c.req.param("slug");

	if (!slug || typeof slug !== "string") {
		return c.json({ error: "Slug parameter is required" }, 400);
	}

	const product = await prisma.product.findUnique({
		where: { slug },
		include: {
			categories: {
				include: {
					category: true,
				},
			},
			specifications: true,
		},
	});

	if (!product) {
		return c.json({ error: "Product not found" }, 404);
	}

	return c.json(product, 200);
};

export const updateProduct = async (c: Context) => {
	const id = c.req.param("id");
	const body = (await c.req.json()) as Prisma.ProductUpdateInput & { slug?: string };

	let slugUpdate: string | undefined;
	const baseSlug = body.slug
		? slugify(body.slug as string)
		: body.name
			? slugify(body.name as string)
			: undefined;

	if (baseSlug) {
		slugUpdate = await ensureUniqueSlug(baseSlug, id);
	}

	const product = await prisma.product.update({
		where: { id },
		data: {
			...body,
			...(body.sizes ? { sizes: body.sizes } : {}),
			...(body.colors ? { colors: body.colors } : {}),
			...(slugUpdate ? { slug: slugUpdate } : {}),
		},
		include: {
			categories: {
				include: {
					category: true,
				},
			},
			specifications: true,
		},
	});

	const productEvent: ProductType = product;
	producer.send("product.updated", { value: JSON.stringify(productEvent) });

	return c.json(product, 200);
};

export const getProductsByIds = async (c: Context) => {
	const idsParam = c.req.query("ids");

	if (!idsParam) {
		return c.json({ error: "ids query parameter is required" }, 400);
	}

	const ids = idsParam.split(",").map((id) => id.trim()).filter(Boolean);

	if (ids.length === 0) {
		return c.json({ error: "At least one product id is required" }, 400);
	}

	if (ids.length > 100) {
		return c.json({ error: "Cannot fetch more than 100 products at once" }, 400);
	}

	const products = await prisma.product.findMany({
		where: { id: { in: ids } },
		include: {
			categories: {
				include: {
					category: true,
				},
			},
			specifications: true,
		},
	});

	return c.json(products, 200);
};

export const deleteProduct = async (c: Context) => {
	const id = c.req.param("id");

	await prisma.product.delete({
		where: { id },
	});

	producer.send("product.deleted", { value: JSON.stringify({ id }) });

	return c.json({ message: "Product deleted successfully" }, 200);
};
