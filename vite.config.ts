import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// base "./" so the built dist/index.html also works when opened straight from disk
export default defineConfig({ plugins: [react()], base: "./" });
