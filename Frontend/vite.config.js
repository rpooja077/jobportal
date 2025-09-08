import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "lucide-react": path.resolve(__dirname, "./src/vendor/lucide-react.jsx"),
      "embla-carousel-react": path.resolve(__dirname, "./src/vendor/embla-carousel-react.jsx"),
      "framer-motion": path.resolve(__dirname, "./src/vendor/framer-motion.jsx"),
    },
  },
})
