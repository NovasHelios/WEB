import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8500,
    proxy: {
      "/api": {
        target: "https://www.helioss.site",
        changeOrigin: true,
        secure: true,
      },
      // SGIS API는 브라우저 직접 호출 대신 개발 서버 프록시를 통해 호출합니다.
      "/sgis": {
        target: "https://sgisapi.kostat.go.kr",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/sgis/, ""),
      },
      // VWorld API는 개발 서버 프록시를 통해 호출해 CORS 문제를 피합니다.
      "/vworld": {
        target: "https://api.vworld.kr",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/vworld/, ""),
      },
    },
  },
});
