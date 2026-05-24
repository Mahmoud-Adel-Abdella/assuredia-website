import { Router } from "express";
import { db, clients, testRuns, flows, scheduler } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import bcrypt from "bcrypt";
import { authenticate, AuthRequest } from "../middlewares/auth";

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
    createdAt: (row.createdAt ?? new Date()).toISOString(),
    baseUrl: row.baseUrl,
    browser: row.browser,
    headless: row.headless,
    aiActive: row.aiActive,
    notifyPolicy: row.notifyPolicy,
    chatId: row.chatId,
    telegramUsername: row.telegramUsername,
    username: row.username,
    isActive: row.isActive,
  };
}

const router = Router();

// GET /api/clients
router.get("/clients", async (req, res) => {
  try {
    const rows = await db.select().from(clients).orderBy(clients.createdAt);
    const out = await Promise.all(
      rows.map(async (c) => toClientJson(c, await latestRunForClient(c.id))),
    );
    res.json(out);
  } catch (err) {
    req.log.error({ err }, "Failed to list clients");
    res.status(500).json({ error: "Internal server error", details: err instanceof Error ? err.message : String(err) });
  }
});

// POST /api/clients - Create new client
const createClientSchema = z.object({
  name: z.string().min(1),
  environment: z.string().min(1).optional(),
  baseUrl: z.string().url().optional(),
  username: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  notifyPolicy: z.enum(["always", "on-failure", "never"]).default("on-failure"),
  browser: z.enum(["chrome", "firefox", "edge"]).default("chrome"),
  headless: z.boolean().default(true),
  aiActive: z.boolean().default(false),
  schedule: z.object({
    cronExpression: z.string(),
    isActive: z.boolean().default(true),
  }).optional(),
});

router.post("/clients", async (req, res) => {
  const parsed = createClientSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body", details: parsed.error });
    return;
  }

  try {
    let hashedPassword: string | null = null;
    if (parsed.data.password && typeof parsed.data.password === "string") {
      hashedPassword = await bcrypt.hash(parsed.data.password, 10);
    }

    const [client] = await db
      .insert(clients)
      .values({
        clientName: parsed.data.name,
        baseUrl: parsed.data.baseUrl || parsed.data.environment || null,
        username: parsed.data.username ?? null,
        passwordHash: hashedPassword,
        notifyPolicy: parsed.data.notifyPolicy,
        browser: parsed.data.browser,
        headless: parsed.data.headless,
        aiActive: parsed.data.aiActive,
        isActive: true,
      })
      .returning();

    const [defaultFlow] = await db
      .insert(flows)
      .values({
        clientId: client.id,
        flowName: "Health Check",
        isActive: true,
      })
      .returning();

    if (parsed.data.schedule) {
      await db.insert(scheduler).values({
        flowId: defaultFlow.id,
        cronExpression: parsed.data.schedule.cronExpression,
        isActive: parsed.data.schedule.isActive,
      });
    } else {
      await db.insert(scheduler).values({
        flowId: defaultFlow.id,
        cronExpression: "*/15 * * * *",
        isActive: true,
      });
    }

    req.log.info({ clientId: client.id }, "Client created with default flow");
    res.status(201).json(toClientJson(client, null));
  } catch (err) {
    req.log.error({ err }, "Failed to create client");
    res.status(500).json({
      error: "Internal server error",
      details: err instanceof Error ? err.message : String(err),
    });
  }
});

// GET /api/clients/:id
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

// PUT /api/clients/:id
const updateClientSchema = z.object({
  name: z.string().min(1).optional(),
  environment: z.string().min(1).optional(),
  baseUrl: z.string().url().optional(),
  username: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  browser: z.enum(["chrome", "firefox", "edge"]).optional(),
  headless: z.boolean().optional(),
  aiActive: z.boolean().optional(),
  notifyPolicy: z.enum(["always", "on-failure", "never"]).optional(),
  isActive: z.boolean().optional(),
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

    if (parsed.data.name !== undefined) patch.clientName = parsed.data.name;
    if (parsed.data.baseUrl !== undefined) patch.baseUrl = parsed.data.baseUrl;
    if (parsed.data.environment !== undefined) patch.baseUrl = parsed.data.environment;
    if (parsed.data.username !== undefined) patch.username = parsed.data.username;
    if (parsed.data.password !== undefined && parsed.data.password !== null) {
      patch.passwordHash = await bcrypt.hash(parsed.data.password, 10);
    }
    if (parsed.data.browser !== undefined) patch.browser = parsed.data.browser;
    if (parsed.data.headless !== undefined) patch.headless = parsed.data.headless;
    if (parsed.data.aiActive !== undefined) patch.aiActive = parsed.data.aiActive;
    if (parsed.data.notifyPolicy !== undefined) patch.notifyPolicy = parsed.data.notifyPolicy;
    if (parsed.data.isActive !== undefined) patch.isActive = parsed.data.isActive;

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

// DELETE /api/clients/:id
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

// GET /api/clients/me
router.get("/clients/me", authenticate, async (req: AuthRequest, res) => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const clientId = req.user.clientId;
  const [client] = await db.select().from(clients).where(eq(clients.id, clientId));
  if (!client) {
    res.status(404).json({ error: "Client not found" });
    return;
  }
  res.json(toClientJson(client, await latestRunForClient(client.id)));
});

export default router;