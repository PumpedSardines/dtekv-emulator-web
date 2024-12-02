import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), wasm(), topLevelAwait()],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
});
