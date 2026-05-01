import { Router } from "express";
import { db, testRunsTable, clientsTable } from "@workspace/db";
import { eq, sql, avg, count, desc } from "drizzle-orm";

const router = Router();

router.get("/reports", async (req, res) => {
  try {
    const clientId = req.query.clientId ? parseInt(req.query.clientId as string) : undefined;

    const rows = await db
      .select({
        id: sql<number>`ROW_NUMBER() OVER (ORDER BY DATE_TRUNC('month', ${testRunsTable.startedAt}) DESC, ${clientsTable.id})`,
        clientId: clientsTable.id,
        clientName: clientsTable.name,
        period: sql<string>`TO_CHAR(DATE_TRUNC('month', ${testRunsTable.startedAt}), 'Mon YYYY')`,
        totalRuns: count(testRunsTable.id),
        avgSuccessRate: sql<number>`ROUND(AVG(CASE WHEN ${testRunsTable.totalTests} > 0 THEN (${testRunsTable.passed}::float / ${testRunsTable.totalTests} * 100) ELSE 100 END)::numeric, 1)`,
        createdAt: sql<string>`MAX(${testRunsTable.startedAt})::text`,
      })
      .from(testRunsTable)
      .innerJoin(clientsTable, eq(testRunsTable.clientId, clientsTable.id))
      .where(clientId ? eq(testRunsTable.clientId, clientId) : undefined)
      .groupBy(clientsTable.id, clientsTable.name, sql`DATE_TRUNC('month', ${testRunsTable.startedAt})`)
      .orderBy(desc(sql`DATE_TRUNC('month', ${testRunsTable.startedAt})`), clientsTable.name);

    res.json(rows.map((r, i) => ({
      id: i + 1,
      clientId: r.clientId,
      clientName: r.clientName,
      period: r.period,
      totalRuns: Number(r.totalRuns),
      avgSuccessRate: Number(r.avgSuccessRate ?? 0),
      createdAt: r.createdAt ?? new Date().toISOString(),
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to list reports");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
