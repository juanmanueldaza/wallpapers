import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "/",
  resolve: {
    alias: {
      "@types": path.resolve(__dirname, "src/types"),
      "@components": path.resolve(__dirname, "src/components"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@styles": path.resolve(__dirname, "src/styles"),
      "@config": path.resolve(__dirname, "src/config"),
    },
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    outDir: "dist",
    assetsInlineLimit: 4096,
    copyPublicDir: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    sourcemap: process.env.NODE_ENV === "development",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          icons: [
            "@fortawesome/fontawesome-svg-core",
            "@fortawesome/free-brands-svg-icons",
            "@fortawesome/free-solid-svg-icons",
            "@fortawesome/react-fontawesome",
          ],
          slideshow: [
            "./src/components/slideshow/Slideshow.tsx",
            "./src/components/slideshow/Controls.tsx",
            "./src/components/slideshow/FullscreenImage.tsx",
            "./src/components/slideshow/GithubButton.tsx",
            "./src/components/slideshow/Loading.tsx",
            "./src/components/slideshow/Thumbnails.tsx",
          ],
        },

        // Asset naming strategy
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: ({ name }) => {
          // Keep images in separate directory
          if (/\.(gif|jpe?g|png|svg|webp)$/.test(name ?? "")) {
            return "assets/images/[name].[hash][extname]";
          }
          // Keep CSS in separate directory
          if (/\.css$/.test(name ?? "")) {
            return "assets/css/[name].[hash][extname]";
          }
          return "assets/[name].[hash][extname]";
        },
      },
    },
  },
  server: {
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true,
      interval: 100,
    },
    port: 3000,
    cors: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
  css: {
    modules: {
      localsConvention: "camelCase",
    },
    devSourcemap: true,
    postcss: {
      plugins: [
        process.env.NODE_ENV === "production"
          ? require("cssnano")({ preset: "default" })
          : null,
      ].filter(Boolean),
    },
  },
  logLevel: "info",
  clearScreen: false,
});
