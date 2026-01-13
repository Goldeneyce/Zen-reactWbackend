import { prisma, Prisma } from "@repo/product-db";
import { Request, Response } from "express";

export const createProductSpecification = async (req: Request, res: Response) => {
	try {
		const data: Prisma.ProductSpecificationCreateInput = req.body;
		const productSpecification = await prisma.productSpecification.create({ data });
		res.status(201).json(productSpecification);
	} catch (error) {
		res.status(500).json({ error: "Failed to create product specification" });
	}
};

export const getProductSpecifications = async (req: Request, res: Response) => {
	try {
		const productSpecifications = await prisma.productSpecification.findMany();
		res.status(200).json(productSpecifications);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch product specifications" });
	}
};

export const getProductSpecification = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const productSpecification = await prisma.productSpecification.findUnique({
			where: { id },
		});

		if (!productSpecification) {
			res.status(404).json({ error: "Product specification not found" });
			return;
		}

		res.status(200).json(productSpecification);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch product specification" });
	}
};

export const updateProductSpecification = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const data: Prisma.ProductSpecificationUpdateInput = req.body;

		const productSpecification = await prisma.productSpecification.update({
			where: { id },
			data,
		});

		res.status(200).json(productSpecification);
	} catch (error) {
		res.status(500).json({ error: "Failed to update product specification" });
	}
};

export const deleteProductSpecification = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		await prisma.productSpecification.delete({
			where: { id },
		});

		res.status(200).json({ message: "Product specification deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: "Failed to delete product specification" });
	}
};