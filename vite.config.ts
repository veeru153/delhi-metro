import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr"
import { VitePWA } from "vite-plugin-pwa"

// https://vitejs.dev/config/
export default defineConfig({
  base: "/delhi-metro/",
  plugins: [
    react(),
    svgr({
      // svgr options: https://react-svgr.com/docs/options/
      svgrOptions: {
        // ...
      },

      // esbuild options, to transform jsx to js
      esbuildOptions: {
        // ...
      },

      // A minimatch pattern, or array of patterns, which specifies the files in the build the plugin should include.
      include: "**/*.svg?react",

      //  A minimatch pattern, or array of patterns, which specifies the files in the build the plugin should ignore. By default no files are ignored.
      exclude: "",
    }),
    VitePWA({
      workbox: {
        globPatterns: ["**/*"],
      },
      includeAssets: [
        "**/*",
      ],
      devOptions: {
        enabled: true
      },
      manifest: {
        name: "Delhi Metro",
        short_name: "Delhi Metro",
        scope: "/delhi-metro/",
        start_url: "/delhi-metro/",
        theme_color: "#c0282c",
        background_color: "transparent",
        display: "standalone",
        prefer_related_applications: false,
        icons: [
          {
            src: '64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: '192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
      }
    })
  ],
})
