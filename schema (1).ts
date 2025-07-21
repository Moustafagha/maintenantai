import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("technician"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const machines = pgTable("machines", {
  id: serial("id").primaryKey(),
  machineId: text("machine_id").notNull().unique(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull().default("operational"), // operational, warning, maintenance
  efficiency: integer("efficiency").notNull().default(100),
  temperature: real("temperature").notNull().default(70),
  vibration: real("vibration").notNull().default(1.0),
  lastMaintenance: timestamp("last_maintenance").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const maintenanceRecords = pgTable("maintenance_records", {
  id: serial("id").primaryKey(),
  machineId: integer("machine_id").references(() => machines.id),
  type: text("type").notNull(), // scheduled, repair, inspection
  description: text("description").notNull(),
  technician: text("technician").notNull(),
  status: text("status").notNull().default("pending"), // pending, in-progress, completed
  scheduledDate: timestamp("scheduled_date"),
  completedDate: timestamp("completed_date"),
  cost: real("cost"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const securityEvents = pgTable("security_events", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(),
  description: text("description").notNull(),
  ipAddress: text("ip_address"),
  username: text("username"),
  severity: text("severity").notNull().default("info"), // info, warning, critical
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

export const insertMachineSchema = createInsertSchema(machines).pick({
  machineId: true,
  name: true,
  type: true,
  status: true,
  efficiency: true,
  temperature: true,
  vibration: true,
});

export const insertMaintenanceRecordSchema = createInsertSchema(maintenanceRecords).pick({
  machineId: true,
  type: true,
  description: true,
  technician: true,
  status: true,
  scheduledDate: true,
  cost: true,
});

export const insertSecurityEventSchema = createInsertSchema(securityEvents).pick({
  eventType: true,
  description: true,
  ipAddress: true,
  username: true,
  severity: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMachine = z.infer<typeof insertMachineSchema>;
export type Machine = typeof machines.$inferSelect;
export type InsertMaintenanceRecord = z.infer<typeof insertMaintenanceRecordSchema>;
export type MaintenanceRecord = typeof maintenanceRecords.$inferSelect;
export type InsertSecurityEvent = z.infer<typeof insertSecurityEventSchema>;
export type SecurityEvent = typeof securityEvents.$inferSelect;
