import { pgTable, serial, integer, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { clientsTable } from "./clients";

export const testRunStatusEnum = pgEnum("test_run_status", ["running", "passed", "failed", "skipped"]);

export const testRunsTable = pgTable("test_runs", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clientsTable.id, { onDelete: "cascade" }),
  flow: text("flow").notNull(),
  status: testRunStatusEnum("status").notNull().default("running"),
  totalTests: integer("total_tests").notNull().default(0),
  passed: integer("passed").notNull().default(0),
  failed: integer("failed").notNull().default(0),
  skipped: integer("skipped").notNull().default(0),
  duration: integer("duration"),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertTestRunSchema = createInsertSchema(testRunsTable).omit({ id: true, startedAt: true });
export type InsertTestRun = z.infer<typeof insertTestRunSchema>;
export type TestRun = typeof testRunsTable.$inferSelect;
