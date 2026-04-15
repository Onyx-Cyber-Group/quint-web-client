import { defineConfig, loadEnv } from "vite";

const FALLBACK_HOST = "https://localhost";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiHost = env.VITE_API_HOST || FALLBACK_HOST;

  return {
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: apiHost,
          changeOrigin: true,
          secure: false,
        },
        "/_matrix": {
          target: apiHost,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
