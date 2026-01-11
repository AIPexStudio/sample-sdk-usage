import path from "node:path";
import { crx, type ManifestV3Export } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import manifest from "./manifest.json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    crx({ manifest: manifest as unknown as ManifestV3Export }),
    viteStaticCopy({
      targets: [
        {
          src: "assets/*",
          dest: "assets",
        },
        {
          src: "host-access-config.json",
          dest: ".",
        },
      ],
    }),
  ],
  resolve: {
    alias: [
      { find: "~", replacement: path.resolve(__dirname, "./src") },
      { find: "@", replacement: path.resolve(__dirname, "./") },
    ],
  },
  css: {
    postcss: "./postcss.config.js", // Use config file instead of inline
    devSourcemap: true, // Enable sourcemaps for debugging
  },
  build: {
    rollupOptions: {
      input: {
        sidepanel: path.resolve(__dirname, "src/pages/sidepanel/index.html"),
        options: path.resolve(__dirname, "src/pages/options/index.html"),
      },
    },
    // Ensure CSS is extracted properly
    cssCodeSplit: false,
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
      // Improve HMR reliability
      overlay: true,
    },
    // Force watch Tailwind files for better HMR
    watch: {
      ignored: ["!**/node_modules/@tailwindcss/**"],
    },
  },
});
