import { Router } from "express";
import { createProductSpecification,
	getProductSpecifications,
	getProductSpecification,
	updateProductSpecification,
	deleteProductSpecification,
} from "../controllers/productSpecification.controller.js";
import { shouldBeAdmin } from "../middleware/authMiddleware.js";

const router: Router = Router();

router.post("/", shouldBeAdmin, createProductSpecification);
router.get("/", getProductSpecifications);
router.get("/:id", getProductSpecification);
router.put("/:id", shouldBeAdmin, updateProductSpecification);
router.delete("/:id", shouldBeAdmin, deleteProductSpecification);
export default router;