import { Router } from "express";
import clientsRouter from "./clients";
import authRouter from "./auth";
import healthRouter from "./health";

const router = Router();

router.use("/clients", clientsRouter);
router.use("/auth", authRouter);
router.use(healthRouter);

export default router;