import { Router } from "express";
import { db, testRunsTable, clientsTable, alertsTable } from "@workspace/db";
import { eq, count, sum, avg, gte, sql } from "drizzle-orm";

const router = Router();

router.get("/dashboard/summary", async (req, res) => {
  try {
    const [clientStats] = await db.select({ total: count() }).from(clientsTable);
    const [runStats] = await db.select({
      totalTests: sum(testRunsTable.totalTests),
      failedTests: sum(testRunsTable.failed),
      avgRate: avg(clientsTable.successRate),
    }).from(testRunsTable).leftJoin(clientsTable, eq(testRunsTable.clientId, clientsTable.id));

    const [activeRuns] = await db.select({ count: count() }).from(testRunsTable)
      .where(eq(testRunsTable.status, "running"));

    const [unresolvedAlerts] = await db.select({ count: count() }).from(alertsTable)
      .where(eq(alertsTable.resolved, false));

    const totalTests = Number(runStats?.totalTests ?? 0);
    const failedTests = Number(runStats?.failedTests ?? 0);
    const successRate = totalTests > 0 ? Math.round(((totalTests - failedTests) / totalTests) * 100 * 10) / 10 : 100;

    res.json({
      successRate,
      totalTests,
      failedTests,
      activeRuns: Number(activeRuns?.count ?? 0),
      totalClients: Number(clientStats?.total ?? 0),
      unresolvedAlerts: Number(unresolvedAlerts?.count ?? 0),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get dashboard summary");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/dashboard/trend", async (req, res) => {
  try {
    const days = req.query.days ? parseInt(req.query.days as string) : 14;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const rows = await db
      .select({
        date: sql<string>`DATE(${testRunsTable.startedAt})::text`,
        passed: sum(testRunsTable.passed),
        failed: sum(testRunsTable.failed),
        skipped: sum(testRunsTable.skipped),
      })
      .from(testRunsTable)
      .where(gte(testRunsTable.startedAt, since))
      .groupBy(sql`DATE(${testRunsTable.startedAt})`)
      .orderBy(sql`DATE(${testRunsTable.startedAt})`);

    const dateMap: Record<string, { passed: number; failed: number; skipped: number }> = {};
    for (const row of rows) {
      dateMap[row.date] = {
        passed: Number(row.passed ?? 0),
        failed: Number(row.failed ?? 0),
        skipped: Number(row.skipped ?? 0),
      };
    }

    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      result.push({
        date: dateStr,
        ...(dateMap[dateStr] ?? { passed: 0, failed: 0, skipped: 0 }),
      });
    }

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to get execution trend");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/dashboard/failed-by-module", async (req, res) => {
  try {
    const rows = await db
      .select({
        module: alertsTable.module,
        count: count(),
      })
      .from(alertsTable)
      .where(sql`${alertsTable.module} IS NOT NULL`)
      .groupBy(alertsTable.module)
      .orderBy(sql`count(*) DESC`)
      .limit(8);

    res.json(rows.map(r => ({
      module: r.module ?? "Unknown",
      count: Number(r.count),
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to get failed by module");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
