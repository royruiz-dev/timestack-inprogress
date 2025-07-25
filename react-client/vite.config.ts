import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      "/api/go": {
        target: "http://go-api:8080", // hostname of 'go-api' service container
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/go/, ""),
      },
      "/api/node": {
        target: "http://node-api:3000", // hostname of 'node-api' service container
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/node/, ""),
      },
    },
  },
});
