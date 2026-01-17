import { Router } from "express";
import { createCategory, deleteCategory, getCategory, getCategoryBySlug, getCategories, updateCategory } from "../controllers/category.controller.js";
import { shouldBeAdmin } from "../middleware/authMiddleware.js";

const router: Router = Router();

router.post("/", shouldBeAdmin, createCategory);
router.get("/", getCategories);
router.get("/slug/:slug", getCategoryBySlug);
router.get("/:id", getCategory);
router.put("/:id", shouldBeAdmin, updateCategory);
router.delete("/:id", shouldBeAdmin, deleteCategory);

export default router;
