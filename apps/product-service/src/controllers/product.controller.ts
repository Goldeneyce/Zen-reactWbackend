import { Request, Response } from "express";
import { prisma, Prisma } from "@repo/product-db";

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

export const createProduct = async (req: Request, res: Response) => {
	const body = req.body as Prisma.ProductCreateInput & { slug?: string };
	const baseSlug = body.slug ? slugify(body.slug) : slugify(body.name);
	const slug = await ensureUniqueSlug(baseSlug);

	const product = await prisma.product.create({
		data: {
			...body,
			slug,
		},
	});
	res.status(201).json(product);
};

export const getProducts = async (req: Request, res: Response) => {
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

	const products = await prisma.product.findMany({
		where: {
			...(validatedSearch ? { name: { contains: validatedSearch, mode: "insensitive" } } : {}),
		},
		take: validatedLimit,
	});
	res.status(200).json(products);
};

export const getProduct = async (req: Request, res: Response) => {
	const { id } = req.params;
	const product = await prisma.product.findUnique({
		where: { id },
	});

	if (!product) {
		res.status(404).json({ error: "Product not found" });
		return;
	}

	res.status(200).json(product);
};

export const getProductBySlug = async (req: Request, res: Response) => {
	const { slug } = req.params;

	if (!slug || typeof slug !== "string") {
		res.status(400).json({ error: "Slug parameter is required" });
		return;
	}

	const product = await prisma.product.findUnique({
		where: { slug },
	});

	if (!product) {
		res.status(404).json({ error: "Product not found" });
		return;
	}

	res.status(200).json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
	const { id } = req.params;
	const body = req.body as Prisma.ProductUpdateInput & { slug?: string };

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
			...(slugUpdate ? { slug: slugUpdate } : {}),
		},
	});

	res.status(200).json(product);
};

export const deleteProduct = async (req: Request, res: Response) => {
	const { id } = req.params;

	await prisma.product.delete({
		where: { id },
	});

	res.status(200).json({ message: "Product deleted successfully" });
};
