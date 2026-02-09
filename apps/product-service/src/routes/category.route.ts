import { Hono } from "hono";
import { createCategory, deleteCategory, getCategory, getCategoryBySlug, getCategories, updateCategory } from "../controllers/category.controller.js";
import { shouldBeProductAdmin } from "../middleware/authMiddleware.js";

const router = new Hono();

router.post("/", shouldBeProductAdmin, createCategory);
router.get("/", getCategories);
router.get("/slug/:slug", getCategoryBySlug);
router.get("/:id", getCategory);
router.put("/:id", shouldBeProductAdmin, updateCategory);
router.delete("/:id", shouldBeProductAdmin, deleteCategory);

export default router;
