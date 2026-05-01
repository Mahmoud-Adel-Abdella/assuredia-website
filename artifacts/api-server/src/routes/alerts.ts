import { Router } from "express";
import { db, alertsTable, clientsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

const router = Router();

router.get("/alerts", async (req, res) => {
  try {
    const clientId = req.query.clientId ? parseInt(req.query.clientId as string) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const alerts = await db
      .select({ alert: alertsTable, clientName: clientsTable.name })
      .from(alertsTable)
      .innerJoin(clientsTable, eq(alertsTable.clientId, clientsTable.id))
      .where(clientId ? eq(alertsTable.clientId, clientId) : undefined)
      .orderBy(desc(alertsTable.createdAt))
      .limit(limit);

    res.json(alerts.map(({ alert, clientName }) => ({
      id: alert.id,
      clientId: alert.clientId,
      clientName,
      testRunId: alert.testRunId ?? null,
      severity: alert.severity,
      message: alert.message,
      module: alert.module ?? null,
      resolved: alert.resolved,
      createdAt: alert.createdAt.toISOString(),
    })));
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
  if (!parsed.success) { res.status(400).json({ error: "Invalid request body" }); return; }
  try {
    const [client] = await db.select().from(clientsTable).where(eq(clientsTable.id, parsed.data.clientId));
    if (!client) { res.status(404).json({ error: "Client not found" }); return; }

    const [alert] = await db.insert(alertsTable).values({
      clientId: parsed.data.clientId,
      testRunId: parsed.data.testRunId ?? null,
      severity: parsed.data.severity,
      message: parsed.data.message,
      module: parsed.data.module ?? null,
      resolved: false,
    }).returning();

    res.status(201).json({
      id: alert.id,
      clientId: alert.clientId,
      clientName: client.name,
      testRunId: alert.testRunId ?? null,
      severity: alert.severity,
      message: alert.message,
      module: alert.module ?? null,
      resolved: alert.resolved,
      createdAt: alert.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create alert");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/alerts/:id/resolve", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    const [result] = await db
      .select({ alert: alertsTable, clientName: clientsTable.name })
      .from(alertsTable)
      .innerJoin(clientsTable, eq(alertsTable.clientId, clientsTable.id))
      .where(eq(alertsTable.id, id));
    if (!result) { res.status(404).json({ error: "Not found" }); return; }

    const [alert] = await db.update(alertsTable).set({ resolved: true }).where(eq(alertsTable.id, id)).returning();
    res.json({
      id: alert.id,
      clientId: alert.clientId,
      clientName: result.clientName,
      testRunId: alert.testRunId ?? null,
      severity: alert.severity,
      message: alert.message,
      module: alert.module ?? null,
      resolved: alert.resolved,
      createdAt: alert.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to resolve alert");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
