import { Hono } from "hono";
import { createProductSpecification,
	getProductSpecifications,
	getProductSpecification,
	updateProductSpecification,
	deleteProductSpecification,
} from "../controllers/productSpecification.controller.js";
import { shouldBeAdmin } from "../middleware/authMiddleware.js";

const router = new Hono();

router.post("/", shouldBeAdmin, createProductSpecification);
router.get("/", getProductSpecifications);
router.get("/:id", getProductSpecification);
router.put("/:id", shouldBeAdmin, updateProductSpecification);
router.delete("/:id", shouldBeAdmin, deleteProductSpecification);
export default router;