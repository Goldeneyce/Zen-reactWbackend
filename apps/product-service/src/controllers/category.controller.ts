import { Request, Response } from "express";
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

export const createCategory = async (req: Request, res: Response) => {
	const body = req.body as Prisma.CategoryCreateInput & { slug?: string };
	const baseSlug = body.slug ? slugify(body.slug) : slugify(body.name);
	const slug = await ensureUniqueSlug(baseSlug);

	const category = await prisma.category.create({
		data: {
			name: body.name,
			slug,
		},
	});
	res.status(201).json(category);
};

export const getCategories = async (req: Request, res: Response) => {
	const { search, limit } = req.query;

	// Validate search parameter
	let validatedSearch: string | undefined;
	if (search) {
		if (typeof search !== "string") {
			res.status(400).json({ error: "Search parameter must be a string" });
			return;
		}
		if (search.length > 100) {
			res.status(400).json({ error: "Search parameter must be 100 characters or less" });
			return;
		}
		validatedSearch = search.trim();
	}

	// Validate limit parameter
	const MAX_LIMIT = 100;
	const DEFAULT_LIMIT = 50;
	let validatedLimit: number | undefined;

	if (limit) {
		if (typeof limit !== "string" || isNaN(Number(limit))) {
			res.status(400).json({ error: "Limit parameter must be a valid number" });
			return;
		}
		const parsedLimit = parseInt(limit, 10);
		if (parsedLimit < 1) {
			res.status(400).json({ error: "Limit must be at least 1" });
			return;
		}
		if (parsedLimit > MAX_LIMIT) {
			res.status(400).json({ error: `Limit cannot exceed ${MAX_LIMIT}` });
			return;
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
	res.status(200).json(categories);
};

export const getCategory = async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id) {
		res.status(400).json({ error: "Category ID is required" });
		return;
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
		res.status(404).json({ error: "Category not found" });
		return;
	}

	res.status(200).json(category);
};

export const getCategoryBySlug = async (req: Request, res: Response) => {
	const { slug } = req.params;

	if (!slug || typeof slug !== "string") {
		res.status(400).json({ error: "Slug parameter is required" });
		return;
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
		res.status(404).json({ error: "Category not found" });
		return;
	}

	res.status(200).json(category);
};

export const updateCategory = async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id) {
		res.status(400).json({ error: "Category ID is required" });
		return;
	}

	const body = req.body as Prisma.CategoryUpdateInput & { slug?: string };

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

	res.status(200).json(category);
};

export const deleteCategory = async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id) {
		res.status(400).json({ error: "Category ID is required" });
		return;
	}

	await prisma.category.delete({
		where: { id: parseInt(id) },
	});

	res.status(200).json({ message: "Category deleted successfully" });
};
