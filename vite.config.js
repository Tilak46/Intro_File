import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    eslint({
      failOnWarning: false, // Don't fail build on warnings
      failOnError: false, // Don't fail build on errors (optional)
      lintOnStart: true, // Lint on startup
      emitWarning: true, // Show warnings
      emitError: true, // Show errors (but don't fail build)
      fix: true, // Auto-fix ESLint issues where possible
    }),
  ],
});
