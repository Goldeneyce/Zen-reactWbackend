import { Router } from "express";
import { createProductSpecification,
	getProductSpecifications,
	getProductSpecification,
	updateProductSpecification,
	deleteProductSpecification,
} from "../controllers/productSpecification.controller.js";

const router: Router = Router();

router.post("/", createProductSpecification);
router.get("/", getProductSpecifications);
router.get("/:id", getProductSpecification);
router.put("/:id", updateProductSpecification);
router.delete("/:id", deleteProductSpecification);

export default router;