import { Hono } from "hono";
import { createProduct, deleteProduct, getProduct, getProductBySlug, getProducts, updateProduct } from "../controllers/product.controller.js";
import { shouldBeAdmin } from "../middleware/authMiddleware.js";

const router = new Hono();

router.post("/", shouldBeAdmin, createProduct);
router.get("/", getProducts);
router.get("/:slug", getProductBySlug);
router.get("/:id", getProduct);
router.put("/:id", shouldBeAdmin, updateProduct);
router.delete("/:id", shouldBeAdmin, deleteProduct);

export default router;