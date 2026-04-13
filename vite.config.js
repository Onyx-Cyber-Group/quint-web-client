import { defineConfig } from "vite";

/**
 * Dev server proxies API + Matrix to the Quint host so the browser never
 * hits self-signed TLS directly (Vite uses Node, which accepts secure:false).
 *
 * Production: deploy this static build behind a reverse proxy that terminates
 * valid TLS to the same host, or point at a hostname with a public CA cert.
 */
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://100.25.66.46",
        changeOrigin: true,
        secure: false,
      },
      "/_matrix": {
        target: "https://100.25.66.46",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
