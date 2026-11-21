import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const guardianNfts = pgTable("guardian_nfts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tokenId: integer("token_id").notNull().unique(),
  contractAddress: text("contract_address").notNull(),
  ownerAddress: text("owner_address").notNull(),
  tier: integer("tier").notNull(), // 0: bronze, 1: silver, 2: gold, 3: omni
  metadata: jsonb("metadata"),
  ipfsUri: text("ipfs_uri"),
  ceremonyHash: text("ceremony_hash").notNull(),
  transactionHash: text("transaction_hash"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const matches = pgTable("matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  matchId: text("match_id").notNull().unique(),
  challenger1: text("challenger1").notNull(),
  challenger2: text("challenger2").notNull(),
  winner: text("winner"),
  tier: integer("tier").notNull(),
  roundScores: jsonb("round_scores"),
  status: text("status").notNull().default("pending"), // pending, resolved, minted
  ceremonyHash: text("ceremony_hash"),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

export const contracts = pgTable("contracts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  address: text("address").notNull(),
  network: text("network").notNull(),
  isActive: boolean("is_active").default(true),
  deployedAt: timestamp("deployed_at").defaultNow(),
});

export const ipfsPins = pgTable("ipfs_pins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ipfsHash: text("ipfs_hash").notNull().unique(),
  name: text("name"),
  size: integer("size"),
  type: text("type"), // metadata, image, etc
  relatedTokenId: integer("related_token_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGuardianNftSchema = createInsertSchema(guardianNfts).omit({
  id: true,
  createdAt: true,
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  createdAt: true,
  resolvedAt: true,
});

export const insertContractSchema = createInsertSchema(contracts).omit({
  id: true,
  deployedAt: true,
});

export const insertIpfsPinSchema = createInsertSchema(ipfsPins).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type GuardianNft = typeof guardianNfts.$inferSelect;
export type InsertGuardianNft = z.infer<typeof insertGuardianNftSchema>;

export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;

export type Contract = typeof contracts.$inferSelect;
export type InsertContract = z.infer<typeof insertContractSchema>;

export type IpfsPin = typeof ipfsPins.$inferSelect;
export type InsertIpfsPin = z.infer<typeof insertIpfsPinSchema>;

// Guardian tier enum
export const GuardianTier = {
  Bronze: 0,
  Silver: 1,
  Gold: 2,
  Omni: 3,
} as const;

export type GuardianTierType = typeof GuardianTier[keyof typeof GuardianTier];
