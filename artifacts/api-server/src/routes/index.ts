import { Router, type IRouter } from "express";
import healthRouter from "./health";
import clientsRouter from "./clients";
import testRunsRouter from "./test-runs";
import alertsRouter from "./alerts";
import dashboardRouter from "./dashboard";
import reportsRouter from "./reports";

const router: IRouter = Router();

router.use(healthRouter);
router.use(clientsRouter);
router.use(testRunsRouter);
router.use(alertsRouter);
router.use(dashboardRouter);
router.use(reportsRouter);

export default router;
