import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import viteCompression from 'vite-plugin-compression'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  // GitHub Pages 部署在子路径 /web/ 下，用相对路径让资源引用不受仓库名影响
  base: './',
  plugins: [
    vue(),
    tailwindcss(), // 激活 Tailwind v4 引擎
    viteCompression({
      threshold: 10240, // 超过 10kb 的文件才压缩
      algorithm: 'gzip',
      ext: '.gz'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    rollupOptions: {
      output: {
        // 分包：把 vue 相关库拆成独立 chunk，利用浏览器缓存
        // 注意：Vite 8 底层是 Rolldown，manualChunks 只支持函数形式（不能用对象）
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (
            id.includes('node_modules/vue/') ||
            id.includes('node_modules/vue-router/') ||
            id.includes('node_modules/pinia/')
          ) {
            return 'vue-vendor'
          }
        }
      }
    }
  }
})
