import { Router } from "express";
import { createCategory, deleteCategory, getCategory, getCategoryBySlug, getCategories, updateCategory } from "../controllers/category.controller.js";

const router: Router = Router();

router.post("/", createCategory);
router.get("/", getCategories);
router.get("/slug/:slug", getCategoryBySlug);
router.get("/:id", getCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
