import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  css: {
    modules: {
      localsConvention: "camelCase",
      generateScopedName: "[name]__[local]__[hash:base64:5]",
    },
  },
});
