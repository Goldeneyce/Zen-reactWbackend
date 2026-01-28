import { Router } from "express";
import { createProduct, deleteProduct, getProduct, getProductBySlug, getProducts, updateProduct } from "../controllers/product.controller.js";
import { shouldBeAdmin } from "../middleware/authMiddleware.js";

const router: Router = Router();

// Temporarily disabled auth for testing - RE-ENABLE IN PRODUCTION!
router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:slug", getProductBySlug);
router.get("/:id", getProduct);
router.put("/:id", shouldBeAdmin, updateProduct);
router.delete("/:id", shouldBeAdmin, deleteProduct);

export default router;