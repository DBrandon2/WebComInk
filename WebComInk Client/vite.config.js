import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "vite-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), visualizer()],
  esbuild: {
    drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/chapter-image": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/covers": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/chapter": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    css: true,
  },
});
