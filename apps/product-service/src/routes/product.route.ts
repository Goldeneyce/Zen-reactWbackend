import { Hono } from "hono";
import { createProduct, deleteProduct, getProduct, getProductBySlug, getProducts, getProductsByIds, updateProduct } from "../controllers/product.controller.js";
import { shouldBeProductAdmin } from "../middleware/authMiddleware.js";

const router = new Hono();

router.post("/", shouldBeProductAdmin, createProduct);
router.get("/", getProducts);
router.get("/bulk", getProductsByIds);
router.get("/:slug", getProductBySlug);
router.get("/:id", getProduct);
router.put("/:id", shouldBeProductAdmin, updateProduct);
router.delete("/:id", shouldBeProductAdmin, deleteProduct);

export default router;