import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // 98.css uses @media (not(hover)) which LightningCSS rejects; skip CSS minification
    // (98.css is already minified, so there's no real loss here)
    cssMinify: false,
  },
})
