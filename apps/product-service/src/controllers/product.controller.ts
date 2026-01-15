import { Request, Response } from "express";
import { prisma, Prisma } from "@repo/product-db";

export const createProduct = async (req: Request, res: Response) => {
	const data: Prisma.ProductCreateInput = req.body;
	const product = await prisma.product.create({ data });
	res.status(201).json(product);
};

export const getProducts = async (req: Request, res: Response) => {
	const products = await prisma.product.findMany();
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

export const updateProduct = async (req: Request, res: Response) => {
	const { id } = req.params;
	const data: Prisma.ProductUpdateInput = req.body;

	const product = await prisma.product.update({
		where: { id },
		data,
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
