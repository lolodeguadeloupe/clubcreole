import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8083,
    allowedHosts: ["www.clubcreole.fr","localhost","clubcreole.fr"],
    historyApiFallback: true,
    proxy: {
      // Rediriger toutes les requêtes non trouvées vers index.html
      '*': {
        target: 'http://localhost:8083',
        changeOrigin: true,
        rewrite: (path) => '/index.html'
      }
    },
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
  define: {
    'process.env': process.env
  }
}));
