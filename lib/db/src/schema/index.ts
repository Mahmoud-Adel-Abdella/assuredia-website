import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  clientName: text("client_name").notNull(),
  chatId: text("chat_id"),
  baseUrl: text("base_url"),
  browser: text("browser"),
  headless: boolean("headless").default(true),
  isActive: boolean("is_active").default(true),
  aiActive: boolean("ai_active").default(false),
  notifyPolicy: text("notify_policy"),
  webhookUrl: text("webhook_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const flows = pgTable("flows", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id")
    .references(() => clients.id, { onDelete: "cascade" })
    .notNull(),
  flowName: text("flow_name").notNull(),
  isActive: boolean("is_active").default(true),
});

export const flowTests = pgTable("flow_tests", {
  id: serial("id").primaryKey(),
  flowId: integer("flow_id")
    .references(() => flows.id, { onDelete: "cascade" })
    .notNull(),
  testClass: text("test_class").notNull(),
  order: integer("order").notNull(),
});

export const scheduler = pgTable("scheduler", {
  id: serial("id").primaryKey(),
  flowId: integer("flow_id")
    .references(() => flows.id, { onDelete: "cascade" })
    .notNull(),
  cronExpression: text("cron_expression").notNull(),
  lastRun: timestamp("last_run"),
  isActive: boolean("is_active").default(true),
});

export const testRuns = pgTable("test_runs", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id")
    .references(() => clients.id, { onDelete: "cascade" })
    .notNull(),
  flowId: integer("flow_id")
    .references(() => flows.id, { onDelete: "cascade" })
    .notNull(),
  status: text("status").notNull(),
  browser: text("browser"),
  env: text("env"),
  total: integer("total").default(0),
  passed: integer("passed").default(0),
  failed: integer("failed").default(0),
  skipped: integer("skipped").default(0),
  durationSeconds: integer("duration_seconds"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const testFailures = pgTable("test_failures", {
  id: serial("id").primaryKey(),
  runId: integer("run_id")
    .references(() => testRuns.id, { onDelete: "cascade" })
    .notNull(),
  testName: text("test_name").notNull(),
  errorMessage: text("error_message"),
  screenshotPath: text("screenshot_path"),
});

export const clientsRelations = relations(clients, ({ many }) => ({
  flows: many(flows),
  testRuns: many(testRuns),
}));

export const flowsRelations = relations(flows, ({ one, many }) => ({
  client: one(clients, { fields: [flows.clientId], references: [clients.id] }),
  flowTests: many(flowTests),
  schedulers: many(scheduler),
  testRuns: many(testRuns),
}));

export const testRunsRelations = relations(testRuns, ({ one, many }) => ({
  client: one(clients, {
    fields: [testRuns.clientId],
    references: [clients.id],
  }),
  flow: one(flows, { fields: [testRuns.flowId], references: [flows.id] }),
  failures: many(testFailures),
}));

export const testFailuresRelations = relations(testFailures, ({ one }) => ({
  testRun: one(testRuns, {
    fields: [testFailures.runId],
    references: [testRuns.id],
  }),
}));
