import { Router } from "express";
import { createProduct, deleteProduct, getProduct, getProductBySlug, getProducts, updateProduct } from "../controllers/product.controller.js";

const router: Router = Router();

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:slug", getProductBySlug);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;