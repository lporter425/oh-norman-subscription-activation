import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 43126,
    strictPort: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 43126,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        preview: resolve(__dirname, "email-preview.html"),
      },
    },
  },
});
