import { pgTable, serial, integer, text, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { clientsTable } from "./clients";
import { testRunsTable } from "./test-runs";

export const alertSeverityEnum = pgEnum("alert_severity", ["critical", "warning", "info"]);

export const alertsTable = pgTable("alerts", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clientsTable.id, { onDelete: "cascade" }),
  testRunId: integer("test_run_id").references(() => testRunsTable.id, { onDelete: "set null" }),
  severity: alertSeverityEnum("severity").notNull(),
  message: text("message").notNull(),
  module: text("module"),
  resolved: boolean("resolved").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAlertSchema = createInsertSchema(alertsTable).omit({ id: true, createdAt: true });
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alertsTable.$inferSelect;
