import { pgTable, serial, varchar, boolean, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("notes", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    is_done: boolean("is_done").default(false).notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
});
