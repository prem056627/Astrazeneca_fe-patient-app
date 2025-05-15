import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path, { resolve } from "path";
import metadata from "./metadata.json";
import { componentTagger } from "lovable-tagger";
import type { Plugin, UserConfig } from 'vite';
// https://vitejs.dev/config/
export default defineConfig(
  ({ mode }): UserConfig => ({
    server: {
      host: "::",
      port: 8080,
      proxy: {
        "/clinic": {
          target: "https://zel3-newmicaresstaging.zelthy.in",
          changeOrigin: true,
        },
        "/doctor": {
          target: "https://zel3-newmicaresstaging.zelthy.in",
          changeOrigin: true,
        },
        "/patient": {
          target: "https://zel3-newmicaresstaging.zelthy.in",
          changeOrigin: true,
        },
        "/appointments": {
          target: "https://zel3-newmicaresstaging.zelthy.in",
          changeOrigin: true,
        },
        "/sku": {
          target: "https://zel3-newmicaresstaging.zelthy.in",
          changeOrigin: true,
        },
        "/common": {
          target: "https://zel3-newmicaresstaging.zelthy.in",
          changeOrigin: true,
        },
        "/coupon": {
          target: "https://zel3-newmicaresstaging.zelthy.in",
          changeOrigin: true,
        },
        "/clinic_orders": {
          target: "https://zel3-newmicaresstaging.zelthy.in",
          changeOrigin: true,
        },
        "/online_consultation": {
          target: "https://zel3-newmicaresstaging.zelthy.in",
          changeOrigin: true,
        },
        "/care_plan": {
          target: "https://zel3-newmicaresstaging.zelthy.in",
          changeOrigin: true,
        },
        "/online_session": {
          target: "https://zel3-newmicaresstaging.zelthy.in",
          changeOrigin: true,
        },
        "/api": {
          target: "https://zel3-newmicaresstaging.zelthy.in",
          changeOrigin: true,
          rewrite: (path) => {
            const updatedPath = path.replace(/api\/api\//i, "");
            console.log("path", updatedPath);
            return updatedPath;
          },
        },
        "/newmi": {
          target: "https://www.newmi.in",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/newmi/, ""),
        },
      },
    },
    plugins: [
      react(),
      // mode === "development" && componentTagger(),
      {
        name: "inline-assets",
        enforce: "post" as const,
        generateBundle(options, bundle) {
          // Handle CSS first
          const cssChunks = Object.keys(bundle).filter((key) =>
            key.endsWith(".css")
          );
          const jsChunks = Object.keys(bundle).filter((key) =>
            key.endsWith(".js")
          );
          const assetChunks = Object.keys(bundle).filter(
            (key) => !key.endsWith(".css") && !key.endsWith(".js")
          );

          if (jsChunks.length) {
            const jsChunk = bundle[jsChunks[0]];
            let injectCode = "";

            // Handle CSS
            if (cssChunks.length) {
              const cssContent = cssChunks
                .map((key) => bundle[key].source)
                .join("\n");

              injectCode += `
              (function() {
                const style = document.createElement('style');
                style.textContent = ${JSON.stringify(cssContent)};
                document.head.appendChild(style);
              })();
            `;
            }

            console.log("bundle", bundle);

            // Handle other assets
            if (assetChunks.length) {
              const assetMap = {};
              assetChunks.forEach((key) => {
                const asset = bundle[key];
                let source = asset.source || asset.code;
                if (source) {
                  if (typeof source !== "string") {
                    source = Buffer.from(source).toString("utf-8");
                  }
                  if (key.endsWith(".svg")) {
                    assetMap[key] = `data:image/svg+xml;base64,${Buffer.from(
                      source
                    ).toString("base64")}`;
                  } else {
                    const base64 = Buffer.from(source).toString("base64");
                    const mimeType = key.endsWith(".png")
                      ? "image/png"
                      : key.endsWith(".jpg") || key.endsWith(".jpeg")
                      ? "image/jpeg"
                      : "application/octet-stream";
                    assetMap[key] = `data:${mimeType};base64,${base64}`;
                  }
                }
              });

              injectCode += `
              (function() {
                window.__vite_assets = ${JSON.stringify(assetMap)};
                // Replace imported asset URLs with base64 versions
                const originalResolveUrl = import.meta.url;
                import.meta.url = new Proxy({}, {
                  get: (target, prop) => {
                    if (window.__vite_assets[prop]) {
                      return window.__vite_assets[prop];
                    }
                    return originalResolveUrl[prop];
                  }
                });
              })();
            `;
            }

            jsChunk.code = injectCode + jsChunk.code;

            // Remove processed chunks
            [...cssChunks, ...assetChunks].forEach((key) => delete bundle[key]);
          }
        },
      },
    ].filter(Boolean) as Plugin[],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    esbuild: {
      // Enhanced tree shaking with esbuild
      treeShaking: true,
      // Preserve pure annotations for better dead code elimination
      legalComments: "none",
      // Minify with esbuild for better tree shaking
      minify: true,
    },
    build: {
      target: "esnext",
      outDir: "dist",
      cssCodeSplit: false,
      assetsInlineLimit: 100000000,
      // Enable source maps in production for easier debugging if needed
      sourcemap: false,
      // Enable minification for better tree shaking
      minify: "terser",
      terserOptions: {
        compress: {
          // Remove console logs in production
          drop_console: true,
          // Aggressive dead code elimination
          pure_getters: true,
          // Remove unused variables
          unused: true,
          // Evaluate expressions when possible
          evaluate: true,
          // Remove unreachable code
          dead_code: true,
        },
        mangle: true,
        format: {
          comments: false,
        },
      },
      rollupOptions: {
        input: resolve(__dirname, "src/main.tsx"),
        output: {
          format: "iife",
          entryFileNames: `build.v${metadata.buildMajor}.${metadata.buildMinor}.${metadata.buildPatch}.js`,
          inlineDynamicImports: true,
          manualChunks: undefined,
        },
      },
      write: true,
      emptyOutDir: true,
    },
    css: {
      modules: {
        generateScopedName: "[name]__[local]___[hash:base64:5]",
      },
    },
  })
);