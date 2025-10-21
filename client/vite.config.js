import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import compression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: "brotliCompress", // or "gzip"
      ext: ".br",
      deleteOriginFile: false,
    }),
    visualizer({
      filename: "bundle-stats.html",
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  server: {
    port: 3000,
    host: true,
    proxy: {
      "/api": {
        target: "https://api.camera-rental.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    target: "esnext",
    chunkSizeWarningLimit: 1000, // Warn if a chunk exceeds 1MB
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
});
