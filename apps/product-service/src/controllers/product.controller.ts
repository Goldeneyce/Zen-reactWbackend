import { Request, Response } from "express";
import { prisma } from "@repo/product-db";
import type { Prisma } from "@repo/product-db";

export const createProduct = async (req:Request, res:Response) => {

    const data: Prisma.ProductCreateInput = req.body;
};
export const updateProduct = async (req:Request, res:Response) => {};
export const deleteProduct = async (req:Request, res:Response) => {};
export const getProducts = async (req:Request, res:Response) => {};
export const getProduct = async (req:Request, res:Response) => {};
