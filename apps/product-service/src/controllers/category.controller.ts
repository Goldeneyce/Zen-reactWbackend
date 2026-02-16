import type { Context } from "hono";
import { prisma, Prisma } from "@repo/product-db";

const slugify = (value: string) =>
	value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "") || "category";

const ensureUniqueSlug = async (base: string, currentId?: number) => {
	let candidate = base;
	let suffix = 1;

	while (true) {
		const existing = await prisma.category.findFirst({
			where: {
				slug: candidate,
				...(currentId ? { id: { not: currentId } } : {}),
			},
		});

		if (!existing) return candidate;
		candidate = `${base}-${suffix++}`;
	}
};

export const createCategory = async (c: Context) => {
	const body = (await c.req.json()) as Prisma.CategoryCreateInput & { slug?: string };
	const baseSlug = body.slug ? slugify(body.slug) : slugify(body.name);
	const slug = await ensureUniqueSlug(baseSlug);

	const category = await prisma.category.create({
		data: {
			name: body.name,
			slug,
		},
	});
	return c.json(category, 201);
};

export const getCategories = async (c: Context) => {
	const { search, limit } = c.req.query();

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

	const categories = await prisma.category.findMany({
		where: {
			...(validatedSearch ? { name: { contains: validatedSearch, mode: "insensitive" } } : {}),
		},
		take: validatedLimit,
		include: {
			_count: {
				select: { products: true },
			},
		},
	});
	return c.json(categories, 200);
};

export const getCategory = async (c: Context) => {
	const id = c.req.param("id");

	if (!id) {
		return c.json({ error: "Category ID is required" }, 400);
	}

	const category = await prisma.category.findUnique({
		where: { id: parseInt(id) },
		include: {
			_count: {
				select: { products: true },
			},
		},
	});

	if (!category) {
		return c.json({ error: "Category not found" }, 404);
	}

	return c.json(category, 200);
};

export const getCategoryBySlug = async (c: Context) => {
	const slug = c.req.param("slug");

	if (!slug || typeof slug !== "string") {
		return c.json({ error: "Slug parameter is required" }, 400);
	}

	const category = await prisma.category.findUnique({
		where: { slug },
		include: {
			products: true,
			_count: {
				select: { products: true },
			},
		},
	});

	if (!category) {
		return c.json({ error: "Category not found" }, 404);
	}

	return c.json(category, 200);
};

export const updateCategory = async (c: Context) => {
	const id = c.req.param("id");

	if (!id) {
		return c.json({ error: "Category ID is required" }, 400);
	}

	const body = (await c.req.json()) as Prisma.CategoryUpdateInput & { slug?: string };

	let slugUpdate: string | undefined;
	const baseSlug = body.slug
		? slugify(body.slug as string)
		: body.name
			? slugify(body.name as string)
			: undefined;

	if (baseSlug) {
		slugUpdate = await ensureUniqueSlug(baseSlug, parseInt(id));
	}

	const category = await prisma.category.update({
		where: { id: parseInt(id) },
		data: {
			name: body.name as string,
			...(slugUpdate ? { slug: slugUpdate } : {}),
		},
	});

	return c.json(category, 200);
};

export const deleteCategory = async (c: Context) => {
	const id = c.req.param("id");

	if (!id) {
		return c.json({ error: "Category ID is required" }, 400);
	}

	await prisma.category.delete({
		where: { id: parseInt(id) },
	});

	return c.json({ message: "Category deleted successfully" }, 200);
};
