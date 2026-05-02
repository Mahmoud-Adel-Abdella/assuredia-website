import { Router } from "express";
import {
  db,
  testFailures,
  testRuns,
  clients,
} from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

const router = Router();

router.get("/alerts", async (req, res) => {
  try {
    const clientId = req.query.clientId
      ? parseInt(req.query.clientId as string)
      : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const rows = await db
      .select({
        failure: testFailures,
        clientName: clients.clientName,
        clientId: clients.id,
        testRunId: testRuns.id,
        runTs: testRuns.timestamp,
      })
      .from(testFailures)
      .innerJoin(testRuns, eq(testFailures.runId, testRuns.id))
      .innerJoin(clients, eq(testRuns.clientId, clients.id))
      .where(clientId ? eq(clients.id, clientId) : undefined)
      .orderBy(desc(testRuns.timestamp))
      .limit(limit);

    const severityFor = (message: string | null) => {
      const m = (message ?? "").toLowerCase();
      if (m.includes("timeout") || m.includes("crash")) return "critical" as const;
      return "warning" as const;
    };

    res.json(
      rows.map(({ failure, clientName, clientId, testRunId, runTs }) => ({
        id: failure.id,
        clientId,
        clientName,
        testRunId,
        severity: severityFor(failure.errorMessage),
        message: failure.errorMessage ?? failure.testName,
        module: failure.testName,
        resolved: false,
        createdAt: (runTs ?? new Date()).toISOString(),
      })),
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list alerts");
    res.status(500).json({ error: "Internal server error" });
  }
});

const createAlertSchema = z.object({
  clientId: z.number().int().positive(),
  testRunId: z.number().int().positive().nullable().optional(),
  severity: z.enum(["critical", "warning", "info"]),
  message: z.string().min(1),
  module: z.string().nullable().optional(),
});

router.post("/alerts", async (req, res) => {
  const parsed = createAlertSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  res.status(501).json({
    error: "Manual alert creation is not supported; alerts are derived from test failures.",
  });
});

router.put("/alerts/:id/resolve", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  try {
    const [row] = await db
      .select({
        failure: testFailures,
        clientId: clients.id,
        clientName: clients.clientName,
        runTs: testRuns.timestamp,
      })
      .from(testFailures)
      .innerJoin(testRuns, eq(testFailures.runId, testRuns.id))
      .innerJoin(clients, eq(testRuns.clientId, clients.id))
      .where(eq(testFailures.id, id));
    if (!row) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    await db.delete(testFailures).where(eq(testFailures.id, id));
    res.json({
      id: row.failure.id,
      clientId: row.clientId,
      clientName: row.clientName,
      testRunId: row.failure.runId,
      severity: "info" as const,
      message: row.failure.errorMessage ?? row.failure.testName,
      module: row.failure.testName,
      resolved: true,
      createdAt: (row.runTs ?? new Date()).toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to resolve alert");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
