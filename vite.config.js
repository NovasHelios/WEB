import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    // React 계열 패키지가 항상 하나의 설치본으로 해석되도록 고정합니다.
    dedupe: ["react", "react-dom", "styled-components"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // HTTP와 HMR WebSocket이 같은 IPv4 서버를 사용하도록 주소를 고정합니다.
    host: "localhost",
    port: 8500,
    // 이미 같은 포트를 사용하는 서버가 있으면 다른 포트로 우회하지 않고 종료합니다.
    strictPort: true,
    // 브라우저의 HMR 연결도 현재 개발 서버 주소와 동일하게 맞춥니다.
    hmr: {
      host: "localhost",
      port: 8500,
      clientPort: 8500,
    },
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
