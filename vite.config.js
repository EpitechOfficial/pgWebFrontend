import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.VITE_API_PROXY_TARGET || "http://localhost/pgcollegeVite/backend-laravel/public";
  const port = Number(env.VITE_DEV_PORT || 5173);

  return {
    plugins: [react()],
    server: {
      fs: {
        allow: [".."]
      },
      port,
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true
        }
      }
    }
  };
});
