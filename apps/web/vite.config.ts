import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: process.env.VITE_BASE_PATH || "/strava-tracker/",
  plugins: [react(), tailwindcss()] as PluginOption[],
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
  },
});
