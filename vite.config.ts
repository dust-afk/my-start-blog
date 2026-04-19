import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // 添加以下配置以适配 Vercel 部署
  base: '/',  // 确保基础路径正确
  build: {
    outDir: 'dist',  // 输出目录
    assetsDir: 'assets',  // 资源文件目录
    emptyOutDir: true,  // 构建前清空输出目录
    sourcemap: false,  // 生产环境关闭 sourcemap 以提高性能
    rollupOptions: {
      output: {
        // 优化 chunk 分割
        manualChunks: {
          vendor: ['vue', 'vue-router']
        }
      }
    }
  },
  // 开发服务器配置
  server: {
    port: 3000,
    host: true
  }
})
