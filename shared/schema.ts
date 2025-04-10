import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (from the template)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Address schema
export const addresses = pgTable("addresses", {
  id: serial("id").primaryKey(),
  address: text("address").notNull(),
  lat: text("lat"),
  lng: text("lng"),
  note: text("note"),
  isStartPoint: boolean("is_start_point").default(false),
  isEndPoint: boolean("is_end_point").default(false),
  routeId: integer("route_id").notNull(),
  sequence: integer("sequence"),
});

export const insertAddressSchema = createInsertSchema(addresses).omit({
  id: true,
});

export type InsertAddress = z.infer<typeof insertAddressSchema>;
export type Address = typeof addresses.$inferSelect;

// Route schema
export const routes = pgTable("routes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  distance: text("distance"),
  duration: text("duration"),
  mapsUrl: text("maps_url"),
  createdAt: timestamp("created_at").defaultNow(),
  lineNotificationSent: boolean("line_notification_sent").default(false),
});

export const insertRouteSchema = createInsertSchema(routes).omit({
  id: true,
  createdAt: true,
});

export type InsertRoute = z.infer<typeof insertRouteSchema>;
export type Route = typeof routes.$inferSelect;

// LineSettings schema
export const lineSettings = pgTable("line_settings", {
  id: serial("id").primaryKey(),
  recipientName: text("recipient_name").notNull(),
  recipientId: text("recipient_id").notNull(),
  isActive: boolean("is_active").default(true),
});

export const insertLineSettingsSchema = createInsertSchema(lineSettings).omit({
  id: true,
});

export type InsertLineSettings = z.infer<typeof insertLineSettingsSchema>;
export type LineSettings = typeof lineSettings.$inferSelect;

// CSV Address Upload Schema
export const csvUploadSchema = z.object({
  addresses: z.array(
    z.object({
      address: z.string().min(1, "地址為必填"),
      note: z.string().optional(),
      isStartPoint: z.boolean().optional(),
      isEndPoint: z.boolean().optional(),
    })
  ),
});

export type CSVUpload = z.infer<typeof csvUploadSchema>;

// Address Input Schema
export const addressInputSchema = z.object({
  startPoint: z.object({
    address: z.string().min(1, "起點地址為必填"),
    note: z.string().optional(),
  }),
  waypoints: z.array(
    z.object({
      address: z.string().min(1, "地址為必填"),
      note: z.string().optional(),
    })
  ),
  endPoint: z.object({
    address: z.string().min(1, "終點地址為必填"),
    note: z.string().optional(),
  }),
});

export type AddressInput = z.infer<typeof addressInputSchema>;

// Line Notification Schema
export const lineNotificationSchema = z.object({
  routeId: z.number(),
  recipientId: z.string().min(1, "請選擇接收通知的LINE使用者/群組"),
  message: z.string().optional(),
});

export type LineNotification = z.infer<typeof lineNotificationSchema>;

// Google Sheet Input Schema
export const googleSheetInputSchema = z.object({
  url: z.string().url("請輸入有效的Google Sheet連結"),
});

export type GoogleSheetInput = z.infer<typeof googleSheetInputSchema>;
