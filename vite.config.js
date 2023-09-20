import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: "**/*.jsx",
    }),
  ],
  server: {
    port: 3000,
  },
  define: {
    "process.env.SERVER_URL": JSON.stringify(
      dotenv.config().parsed.SERVER_URL
    ),
  },
});
