import { Router } from "express";
import { db, clients, testRuns } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

type ClientRow = typeof clients.$inferSelect;
type RunRow = typeof testRuns.$inferSelect;

async function latestRunForClient(clientId: number): Promise<RunRow | null> {
  const [run] = await db
    .select()
    .from(testRuns)
    .where(eq(testRuns.clientId, clientId))
    .orderBy(desc(testRuns.timestamp))
    .limit(1);
  return run ?? null;
}

function clientHealthStatus(row: ClientRow, last: RunRow | null) {
  if (!row.isActive) return "inactive" as const;
  const failed = last?.failed ?? 0;
  if (!failed) return "active" as const;
  if (failed > 2) return "error" as const;
  return "warning" as const;
}

function successRateFromRun(last: RunRow | null): number {
  if (!last) return 100;
  const total = last.total ?? 0;
  if (total <= 0) return 100;
  const passed = last.passed ?? 0;
  return Math.round((passed / total) * 100);
}

function toClientJson(row: ClientRow, last: RunRow | null) {
  return {
    id: row.id,
    name: row.clientName,
    environment: row.baseUrl ?? "",
    status: clientHealthStatus(row, last),
    successRate: successRateFromRun(last),
    lastRunAt: last?.timestamp?.toISOString() ?? null,
    webhookUrl: row.webhookUrl ?? null,
    createdAt: (row.createdAt ?? new Date()).toISOString(),
  };
}

const router = Router();

router.get("/clients", async (req, res) => {
  try {
    const rows = await db.select().from(clients).orderBy(clients.createdAt);
    const out = await Promise.all(
      rows.map(async (c) => toClientJson(c, await latestRunForClient(c.id))),
    );
    res.json(out);
  } catch (err) {
    req.log.error({ err }, "Failed to list clients");
    res.status(500).json({ error: "Internal server error" });
  }
});

const createClientSchema = z.object({
  name: z.string().min(1),
  environment: z.string().min(1),
  webhookUrl: z.string().nullable().optional(),
});

router.post("/clients", async (req, res) => {
  const parsed = createClientSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  try {
    const [client] = await db
      .insert(clients)
      .values({
        clientName: parsed.data.name,
        baseUrl: parsed.data.environment,
        webhookUrl: parsed.data.webhookUrl ?? null,
        isActive: true,
      })
      .returning();
    res.status(201).json(toClientJson(client, null));
  } catch (err) {
    req.log.error({ err }, "Failed to create client");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/clients/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  try {
    const [row] = await db.select().from(clients).where(eq(clients.id, id));
    if (!row) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(toClientJson(row, await latestRunForClient(row.id)));
  } catch (err) {
    req.log.error({ err }, "Failed to get client");
    res.status(500).json({ error: "Internal server error" });
  }
});

const updateClientSchema = z.object({
  name: z.string().min(1).optional(),
  environment: z.string().min(1).optional(),
  status: z.enum(["active", "inactive", "warning", "error"]).optional(),
  webhookUrl: z.string().nullable().optional(),
});

router.put("/clients/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = updateClientSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  try {
    const patch: Partial<typeof clients.$inferInsert> = {};
    if (parsed.data.name !== undefined)
      patch.clientName = parsed.data.name;
    if (parsed.data.environment !== undefined)
      patch.baseUrl = parsed.data.environment;
    if (parsed.data.webhookUrl !== undefined)
      patch.webhookUrl = parsed.data.webhookUrl;
    if (parsed.data.status !== undefined)
      patch.isActive = parsed.data.status !== "inactive";

    const [client] = await db
      .update(clients)
      .set(patch)
      .where(eq(clients.id, id))
      .returning();
    if (!client) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(toClientJson(client, await latestRunForClient(client.id)));
  } catch (err) {
    req.log.error({ err }, "Failed to update client");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/clients/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  try {
    await db.delete(clients).where(eq(clients.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete client");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
