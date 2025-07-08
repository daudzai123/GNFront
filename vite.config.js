import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@core": path.resolve(__dirname, "./src/core"),
    },
  },
  plugins: [react()],
});
