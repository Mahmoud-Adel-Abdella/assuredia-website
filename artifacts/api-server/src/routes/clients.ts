import { Router } from "express";
import { db, clientsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router = Router();

router.get("/clients", async (req, res) => {
  try {
    const clients = await db.select().from(clientsTable).orderBy(clientsTable.createdAt);
    res.json(clients.map(c => ({
      id: c.id,
      name: c.name,
      environment: c.environment,
      status: c.status,
      successRate: c.successRate,
      lastRunAt: c.lastRunAt?.toISOString() ?? null,
      webhookUrl: c.webhookUrl ?? null,
      createdAt: c.createdAt.toISOString(),
    })));
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
    const [client] = await db.insert(clientsTable).values({
      name: parsed.data.name,
      environment: parsed.data.environment,
      webhookUrl: parsed.data.webhookUrl ?? null,
      status: "active",
      successRate: 100,
    }).returning();
    res.status(201).json({
      id: client.id,
      name: client.name,
      environment: client.environment,
      status: client.status,
      successRate: client.successRate,
      lastRunAt: client.lastRunAt?.toISOString() ?? null,
      webhookUrl: client.webhookUrl ?? null,
      createdAt: client.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create client");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/clients/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    const [client] = await db.select().from(clientsTable).where(eq(clientsTable.id, id));
    if (!client) { res.status(404).json({ error: "Not found" }); return; }
    res.json({
      id: client.id,
      name: client.name,
      environment: client.environment,
      status: client.status,
      successRate: client.successRate,
      lastRunAt: client.lastRunAt?.toISOString() ?? null,
      webhookUrl: client.webhookUrl ?? null,
      createdAt: client.createdAt.toISOString(),
    });
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
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = updateClientSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid request body" }); return; }
  try {
    const [client] = await db.update(clientsTable).set(parsed.data).where(eq(clientsTable.id, id)).returning();
    if (!client) { res.status(404).json({ error: "Not found" }); return; }
    res.json({
      id: client.id,
      name: client.name,
      environment: client.environment,
      status: client.status,
      successRate: client.successRate,
      lastRunAt: client.lastRunAt?.toISOString() ?? null,
      webhookUrl: client.webhookUrl ?? null,
      createdAt: client.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to update client");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/clients/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    await db.delete(clientsTable).where(eq(clientsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete client");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
