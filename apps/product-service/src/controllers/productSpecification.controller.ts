import { prisma, Prisma } from "@repo/product-db";
import { Request, Response } from "express";

export const createProductSpecification = async (req: Request, res: Response) => {
	const { productId, key, value } = req.body as {
		productId?: string;
		key?: string;
		value?: string;
	};

	if (!productId) {
		res.status(400).json({ error: "productId is required" });
		return;
	}

	const product = await prisma.product.findUnique({ where: { id: productId } });
	if (!product) {
		res.status(404).json({ error: "Product not found" });
		return;
	}

	const productSpecification = await prisma.productSpecification.create({
		data: {
			key: key ?? "",
			value: value ?? "",
			product: { connect: { id: productId } },
		},
	});

	res.status(201).json(productSpecification);
};

export const getProductSpecifications = async (req: Request, res: Response) => {
	const productSpecifications = await prisma.productSpecification.findMany();
	res.status(200).json(productSpecifications);
};

export const getProductSpecification = async (req: Request, res: Response) => {
	const { id } = req.params;
	const productSpecification = await prisma.productSpecification.findUnique({
		where: { id },
	});

	if (!productSpecification) {
		res.status(404).json({ error: "Product specification not found" });
		return;
	}

	res.status(200).json(productSpecification);
};

export const updateProductSpecification = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { productId, key, value } = req.body as {
		productId?: string;
		key?: string;
		value?: string;
	};

	const data: Prisma.ProductSpecificationUpdateInput = {};
	if (key !== undefined) data.key = key;
	if (value !== undefined) data.value = value;

	if (productId) {
		const product = await prisma.product.findUnique({ where: { id: productId } });
		if (!product) {
			res.status(404).json({ error: "Product not found" });
			return;
		}
		data.product = { connect: { id: productId } };
	}

	const productSpecification = await prisma.productSpecification.update({
		where: { id },
		data,
	});

	res.status(200).json(productSpecification);
};

export const deleteProductSpecification = async (req: Request, res: Response) => {
	const { id } = req.params;

	await prisma.productSpecification.delete({
		where: { id },
	});

	res.status(200).json({ message: "Product specification deleted successfully" });
};