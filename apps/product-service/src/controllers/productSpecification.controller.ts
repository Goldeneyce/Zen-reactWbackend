import { prisma, Prisma } from "@repo/product-db";
import type { Context } from "hono";

export const createProductSpecification = async (c: Context) => {
	const { productId, key, value } = (await c.req.json()) as {
		productId?: string;
		key?: string;
		value?: string;
	};

	if (!productId) {
		return c.json({ error: "productId is required" }, 400);
	}

	const product = await prisma.product.findUnique({ where: { id: productId } });
	if (!product) {
		return c.json({ error: "Product not found" }, 404);
	}

	const productSpecification = await prisma.productSpecification.create({
		data: {
			key: key ?? "",
			value: value ?? "",
			product: { connect: { id: productId } },
		},
	});

	return c.json(productSpecification, 201);
};

export const getProductSpecifications = async (c: Context) => {
	const productSpecifications = await prisma.productSpecification.findMany();
	return c.json(productSpecifications, 200);
};

export const getProductSpecification = async (c: Context) => {
	const id = c.req.param("id");
	const productSpecification = await prisma.productSpecification.findUnique({
		where: { id },
	});

	if (!productSpecification) {
		return c.json({ error: "Product specification not found" }, 404);
	}

	return c.json(productSpecification, 200);
};

export const updateProductSpecification = async (c: Context) => {
	const id = c.req.param("id");
	const { productId, key, value } = (await c.req.json()) as {
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
			return c.json({ error: "Product not found" }, 404);
		}
		data.product = { connect: { id: productId } };
	}

	const productSpecification = await prisma.productSpecification.update({
		where: { id },
		data,
	});

	return c.json(productSpecification, 200);
};

export const deleteProductSpecification = async (c: Context) => {
	const id = c.req.param("id");

	await prisma.productSpecification.delete({
		where: { id },
	});

	return c.json({ message: "Product specification deleted successfully" }, 200);
};