import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Включаем поддержку кэширования внешних ресурсов (например, иконок магазинов)
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 год
              },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'], // Плагин сам добавит их в head
      manifest: {
        name: 'Sale Hunter - Умные скидки',
        short_name: 'SaleHunter',
        description: 'Поиск лучших цен в магазинах города',
        theme_color: '#ef4444', // Цвет верхней полоски в мобильном браузере
        background_color: '#ffffff',
        display: 'standalone', // Запуск без адресной строки браузера
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Для красивых иконок на Android
          }
        ]
      }
    })
  ]
})