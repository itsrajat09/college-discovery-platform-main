import path from "node:path";
import { defineConfig } from "prisma/config";
import { PrismaNeon } from "@prisma/adapter-neon";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrate: {
    async adapter() {
      return new PrismaNeon({
        connectionString: process.env.DATABASE_URL!,
      });
    },
  },
  datasources: {
    db: {
      url: process.env.DATABASE_URL!,
    },
  },
});