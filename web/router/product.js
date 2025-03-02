import { Router } from "express";
import { productController } from "../controllers/index.js";

const productRouter = Router();

productRouter.get("/", productController.getProductDetailsById);

export { productRouter };