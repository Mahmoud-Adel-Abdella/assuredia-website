import { Router } from "express";
import { db, testRuns, clients, flows, testFailures } from "@workspace/db";
import { and, eq, desc } from "drizzle-orm";
import { z } from "zod";

const router = Router();

function toRunJson(
  run: typeof testRuns.$inferSelect,
  clientName: string,
  flowName: string,
) {
  const total = run.total ?? 0;
  const ts = run.timestamp ?? new Date();
  const durationMs =
    run.durationSeconds != null ? run.durationSeconds * 1000 : null;
  return {
    id: run.id,
    clientId: run.clientId,
    clientName,
    flow: flowName,
    status: run.status,
    totalTests: total,
    passed: run.passed ?? 0,
    failed: run.failed ?? 0,
    skipped: run.skipped ?? 0,
    duration: durationMs,
    startedAt: ts.toISOString(),
    completedAt: ts.toISOString(),
  };
}

async function getOrCreateFlow(clientId: number, flowName: string) {
  const [existing] = await db
    .select()
    .from(flows)
    .where(and(eq(flows.clientId, clientId), eq(flows.flowName, flowName)))
    .limit(1);
  if (existing) return existing;
  const [created] = await db
    .insert(flows)
    .values({ clientId, flowName, isActive: true })
    .returning();
  return created!;
}

router.get("/test-runs", async (req, res) => {
  try {
    const clientId = req.query.clientId
      ? parseInt(req.query.clientId as string)
      : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

    const rows = await db
      .select({
        run: testRuns,
        clientName: clients.clientName,
        flowName: flows.flowName,
      })
      .from(testRuns)
      .innerJoin(clients, eq(testRuns.clientId, clients.id))
      .innerJoin(flows, eq(testRuns.flowId, flows.id))
      .where(clientId ? eq(testRuns.clientId, clientId) : undefined)
      .orderBy(desc(testRuns.timestamp))
      .limit(limit);

    res.json(
      rows.map(({ run, clientName, flowName }) =>
        toRunJson(run, clientName, flowName),
      ),
    );
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
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  try {
    const [clientRow] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, parsed.data.clientId));
    if (!clientRow) {
      res.status(404).json({ error: "Client not found" });
      return;
    }

    const totalTests = Math.floor(Math.random() * 50) + 20;
    const failed = Math.floor(Math.random() * 5);
    const skipped = Math.floor(Math.random() * 3);
    const passed = totalTests - failed - skipped;
    const durationSeconds = Math.floor(Math.random() * 120) + 10;

    const flowRow = await getOrCreateFlow(
      parsed.data.clientId,
      parsed.data.flow,
    );

    if (parsed.data.webhookUrl != null) {
      await db
        .update(clients)
        .set({ webhookUrl: parsed.data.webhookUrl })
        .where(eq(clients.id, parsed.data.clientId));
    }

    const [run] = await db
      .insert(testRuns)
      .values({
        clientId: parsed.data.clientId,
        flowId: flowRow.id,
        status: failed > 0 ? "failed" : "passed",
        total: totalTests,
        passed,
        failed,
        skipped,
        durationSeconds,
        timestamp: new Date(),
      })
      .returning();

    if (failed > 0) {
      await db.insert(testFailures).values(
        Array.from({ length: Math.min(failed, 5) }, (_, i) => ({
          runId: run.id,
          testName: `Suite step ${i + 1}`,
          errorMessage: "Assertion Error: Selector not found within timeout.",
          screenshotPath: null,
        })),
      );
    }

    res.status(201).json(
      toRunJson(run, clientRow.clientName, flowRow.flowName),
    );
  } catch (err) {
    req.log.error({ err }, "Failed to create test run");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/test-runs/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  try {
    const [result] = await db
      .select({
        run: testRuns,
        clientName: clients.clientName,
        flowName: flows.flowName,
      })
      .from(testRuns)
      .innerJoin(clients, eq(testRuns.clientId, clients.id))
      .innerJoin(flows, eq(testRuns.flowId, flows.id))
      .where(eq(testRuns.id, id));
    if (!result) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(
      toRunJson(result.run, result.clientName, result.flowName),
    );
  } catch (err) {
    req.log.error({ err }, "Failed to get test run");
    res.status(500).json({ error: "Internal server error" });
  }
});
const webhookResultSchema = z.object({
  client: z.string(),
  flow: z.string(),
  status: z.string(),
  total: z.number(),
  passed: z.number(),
  failed: z.number(),
  skipped: z.number(),
  durationSeconds: z.number(),
  failures: z.array(z.object({
    testName: z.string(),
    errorMessage: z.string().nullable().optional(),
    screenshotPath: z.string().nullable().optional(),
  })).optional(),
});

router.post("/test-runs/webhook", async (req, res) => {
  const parsed = webhookResultSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  try {
    const { client, flow, status, total, passed, failed, skipped, durationSeconds, failures } = parsed.data;

    // ابحث عن الـ client
    const [clientRow] = await db
      .select()
      .from(clients)
      .where(eq(clients.clientName, client));

    if (!clientRow) {
      res.status(404).json({ error: "Client not found" });
      return;
    }

    const flowRow = await getOrCreateFlow(clientRow.id, flow);

    const [run] = await db
      .insert(testRuns)
      .values({
        clientId: clientRow.id,
        flowId: flowRow.id,
        status,
        total,
        passed,
        failed,
        skipped,
        durationSeconds,
        timestamp: new Date(),
      })
      .returning();

    // احفظ الـ failures
    if (failures && failures.length > 0) {
      await db.insert(testFailures).values(
        failures.map(f => ({
          runId: run.id,
          testName: f.testName,
          errorMessage: f.errorMessage ?? null,
          screenshotPath: f.screenshotPath ?? null,
        }))
      );
    }

    res.status(201).json({ success: true, runId: run.id });
  } catch (err) {
    req.log.error({ err }, "Failed to save webhook result");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
