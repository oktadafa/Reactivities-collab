import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    origin: "http://0.0.0.0:5173",
    strictPort: true,
  },
  preview: {
    port: 5173,
    strictPort: true,
  },
});
