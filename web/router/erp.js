import { Router } from "express";
import { erpController } from "../controllers/index.js";

const erpRouter = Router();

erpRouter.get("/", erpController.getSettings);

erpRouter.post("/", erpController.saveSettings);

export { erpRouter };