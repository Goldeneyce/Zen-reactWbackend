import { prisma, Prisma } from "@repo/product-db";
import { Request, Response } from "express";

export const createProductSpecification = async (req: Request, res: Response) => {
	const data: Prisma.ProductSpecificationCreateInput = req.body;
	const productSpecification = await prisma.productSpecification.create({ data });
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
	const data: Prisma.ProductSpecificationUpdateInput = req.body;

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