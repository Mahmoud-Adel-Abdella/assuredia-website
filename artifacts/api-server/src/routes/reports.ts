import { Router } from "express";
import { db, testRuns, clients } from "@workspace/db";
import { eq, sql, count, desc } from "drizzle-orm";

const router = Router();

router.get("/reports", async (req, res) => {
  try {
    const clientId = req.query.clientId
      ? parseInt(req.query.clientId as string)
      : undefined;

    const rows = await db
      .select({
        id: sql<number>`ROW_NUMBER() OVER (ORDER BY DATE_TRUNC('month', ${testRuns.timestamp}) DESC, ${clients.id})`,
        clientId: clients.id,
        clientName: clients.clientName,
        period: sql<string>`TO_CHAR(DATE_TRUNC('month', ${testRuns.timestamp}), 'Mon YYYY')`,
        totalRuns: count(testRuns.id),
        avgSuccessRate: sql<number>`ROUND(AVG(CASE WHEN ${testRuns.total} > 0 THEN (${testRuns.passed}::float / ${testRuns.total} * 100) ELSE 100 END)::numeric, 1)`,
        createdAt: sql<string>`MAX(${testRuns.timestamp})::text`,
      })
      .from(testRuns)
      .innerJoin(clients, eq(testRuns.clientId, clients.id))
      .where(clientId ? eq(testRuns.clientId, clientId) : undefined)
      .groupBy(
        clients.id,
        clients.clientName,
        sql`DATE_TRUNC('month', ${testRuns.timestamp})`,
      )
      .orderBy(
        desc(sql`DATE_TRUNC('month', ${testRuns.timestamp})`),
        clients.clientName,
      );

    res.json(
      rows.map((r, i) => ({
        id: i + 1,
        clientId: r.clientId,
        clientName: r.clientName,
        period: r.period,
        totalRuns: Number(r.totalRuns),
        avgSuccessRate: Number(r.avgSuccessRate ?? 0),
        createdAt: r.createdAt ?? new Date().toISOString(),
      })),
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list reports");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
