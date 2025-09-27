import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Only include lovable-tagger if it's available (for Lovable platform)
    mode === "development" && (() => {
      try {
        const { componentTagger } = require("lovable-tagger");
        return componentTagger();
      } catch {
        // lovable-tagger not available in local development
        return null;
      }
    })()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
