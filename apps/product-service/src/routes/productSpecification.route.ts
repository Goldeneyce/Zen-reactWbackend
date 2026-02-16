import { Hono } from "hono";
import { createProductSpecification,
	getProductSpecifications,
	getProductSpecification,
	updateProductSpecification,
	deleteProductSpecification,
} from "../controllers/productSpecification.controller.js";
import { shouldBeProductAdmin } from "../middleware/authMiddleware.js";

const router = new Hono();

router.post("/", shouldBeProductAdmin, createProductSpecification);
router.get("/", getProductSpecifications);
router.get("/:id", getProductSpecification);
router.put("/:id", shouldBeProductAdmin, updateProductSpecification);
router.delete("/:id", shouldBeProductAdmin, deleteProductSpecification);
export default router;