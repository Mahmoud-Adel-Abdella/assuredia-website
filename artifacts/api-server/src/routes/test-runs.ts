import { Router } from "express";
import { db, testRunsTable, clientsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

const router = Router();

router.get("/test-runs", async (req, res) => {
  try {
    const clientId = req.query.clientId ? parseInt(req.query.clientId as string) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

    const runs = await db
      .select({
        run: testRunsTable,
        clientName: clientsTable.name,
      })
      .from(testRunsTable)
      .innerJoin(clientsTable, eq(testRunsTable.clientId, clientsTable.id))
      .where(clientId ? eq(testRunsTable.clientId, clientId) : undefined)
      .orderBy(desc(testRunsTable.startedAt))
      .limit(limit);

    res.json(runs.map(({ run, clientName }) => ({
      id: run.id,
      clientId: run.clientId,
      clientName,
      flow: run.flow,
      status: run.status,
      totalTests: run.totalTests,
      passed: run.passed,
      failed: run.failed,
      skipped: run.skipped,
      duration: run.duration ?? null,
      startedAt: run.startedAt.toISOString(),
      completedAt: run.completedAt?.toISOString() ?? null,
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to list test runs");
    res.status(500).json({ error: "Internal server error" });
  }
});

const createTestRunSchema = z.object({
  clientId: z.number().int().positive(),
  flow: z.string().min(1),
  webhookUrl: z.string().nullable().optional(),
});

router.post("/test-runs", async (req, res) => {
  const parsed = createTestRunSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid request body" }); return; }
  try {
    const [client] = await db.select().from(clientsTable).where(eq(clientsTable.id, parsed.data.clientId));
    if (!client) { res.status(404).json({ error: "Client not found" }); return; }

    const totalTests = Math.floor(Math.random() * 50) + 20;
    const failed = Math.floor(Math.random() * 5);
    const skipped = Math.floor(Math.random() * 3);
    const passed = totalTests - failed - skipped;
    const duration = Math.floor(Math.random() * 120000) + 10000;

    const [run] = await db.insert(testRunsTable).values({
      clientId: parsed.data.clientId,
      flow: parsed.data.flow,
      status: failed > 0 ? "failed" : "passed",
      totalTests,
      passed,
      failed,
      skipped,
      duration,
      completedAt: new Date(),
    }).returning();

    const successRate = Math.round((passed / totalTests) * 100);
    await db.update(clientsTable).set({
      successRate,
      lastRunAt: new Date(),
      status: failed > 2 ? "error" : failed > 0 ? "warning" : "active",
    }).where(eq(clientsTable.id, parsed.data.clientId));

    res.status(201).json({
      id: run.id,
      clientId: run.clientId,
      clientName: client.name,
      flow: run.flow,
      status: run.status,
      totalTests: run.totalTests,
      passed: run.passed,
      failed: run.failed,
      skipped: run.skipped,
      duration: run.duration ?? null,
      startedAt: run.startedAt.toISOString(),
      completedAt: run.completedAt?.toISOString() ?? null,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create test run");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/test-runs/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    const [result] = await db
      .select({ run: testRunsTable, clientName: clientsTable.name })
      .from(testRunsTable)
      .innerJoin(clientsTable, eq(testRunsTable.clientId, clientsTable.id))
      .where(eq(testRunsTable.id, id));
    if (!result) { res.status(404).json({ error: "Not found" }); return; }
    const { run, clientName } = result;
    res.json({
      id: run.id,
      clientId: run.clientId,
      clientName,
      flow: run.flow,
      status: run.status,
      totalTests: run.totalTests,
      passed: run.passed,
      failed: run.failed,
      skipped: run.skipped,
      duration: run.duration ?? null,
      startedAt: run.startedAt.toISOString(),
      completedAt: run.completedAt?.toISOString() ?? null,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get test run");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
