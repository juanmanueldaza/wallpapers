import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "/",
  resolve: {
    alias: {
      "@types": path.resolve(__dirname, "./src/types"), // Alias @src to the src directory
      "@components": path.resolve(__dirname, "./src/components"), // Alias @components to src/components
      "@utils": path.resolve(__dirname, "./src/utils"), // Alias @utils to src/utils
      "@styles": path.resolve(__dirname, "./src/styles"), //Alias @styles to src/styles
      "@config": path.resolve(__dirname, "./src/config"), //Alias @config to src/config
    },
  },
  build: {
    outDir: "dist",
    assetsInlineLimit: 0,
    copyPublicDir: true,
  },
  publicDir: "public",
});
