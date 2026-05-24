import { Router } from "express";
import clientsRouter from "./clients";
import authRouter from "./auth";

const router = Router();

router.use("/clients", clientsRouter);
router.use("/auth", authRouter);

export default router;