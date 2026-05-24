import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig(({ mode }) => {
  // لتحميل المتغيرات من ملفات .env بشكل صحيح
  const env = loadEnv(mode, process.cwd(), '');

  // استخدام قيمة افتراضية أثناء البناء إذا لم يكن PORT موجوداً
  const port = env.PORT ? Number(env.PORT) : 5173;
  const basePath = env.BASE_PATH || "/";

  return {
    base: basePath,
    plugins: [
      react(),
      tailwindcss(),
      runtimeErrorOverlay(),
      ...(process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined
        ? [
            // هذه المكونات الإضافية خاصة بـ Replit ويمكن أن تسبب مشاكل على Vercel
            // await import("@replit/vite-plugin-cartographer").then((m) =>
            //   m.cartographer({
            //     root: path.resolve(import.meta.dirname, ".."),
            //   }),
            // ),
            // await import("@replit/vite-plugin-dev-banner").then((m) =>
            //   m.devBanner(),
            // ),
          ]
        : []),
    ],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src"),
        "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
      },
      dedupe: ["react", "react-dom"],
    },
    root: path.resolve(import.meta.dirname),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      port,
      strictPort: false,
      host: "0.0.0.0",
      allowedHosts: true,
      fs: {
        strict: true,
      },
    },
    preview: {
      port,
      host: "0.0.0.0",
      allowedHosts: true,
    },
  };
});