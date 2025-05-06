import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins = [react()];

  if (mode === "development") {
    const { componentTagger } = await import("lovable-tagger");
    const taggerPlugin = componentTagger();
    if (Array.isArray(taggerPlugin)) {
      plugins.push(...taggerPlugin);
    } else {
      plugins.push(...(Array.isArray(taggerPlugin) ? taggerPlugin : [taggerPlugin]));
    }
  }

  return {
    server: {
      host: "::",
      port: 8080,
      allowedHosts: ["www.clubcreole.fr", "clubcreole.fr","localhost","dev.clubcreole.fr"],
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      'process.env': process.env
    }
  };
});
