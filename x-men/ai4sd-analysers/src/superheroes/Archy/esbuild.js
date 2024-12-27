const { build } = require("esbuild");

const baseConfig = {
  bundle: true,
  minify: process.env.NODE_ENV === "production",
  sourcemap: process.env.NODE_ENV !== "production",
};

const extensionConfig = {
  ...baseConfig,
  platform: "node",
  mainFields: ["module", "main"],
  format: "cjs",
  entryPoints: ["src/superheroes/Archy/webview/main.mts"], // Correct path
  outfile: "./out/superheroes/Archy/webview.js",
  external: ["vscode"],
};

const webviewConfig = {
  ...baseConfig,
  target: "es2020",
  format: "esm",
  entryPoints: ["src/superheroes/Archy/webview/main.mts"], // Correct path
  outfile: "./out/superheroes/Archy/webview.js",
};

(async () => {
  const args = process.argv.slice(2);
  try {
    console.log("Building extension and webview...");

    if (args.includes("--watch")) {
      // Watch for changes
      console.log("[watch] Build started");
      await build({
        ...extensionConfig,
        watch: {
          onRebuild(error, result) {
            if (error) {
              console.error("Build error:", error);
            } else {
              console.log("Build finished:", result);
            }
          },
        },
      });
      await build({
        ...webviewConfig,
        watch: {
          onRebuild(error, result) {
            if (error) {
              console.error("Webview build error:", error);
            } else {
              console.log("Webview build finished:", result);
            }
          },
        },
      });
    } else {
      // Standard build without watch
      await build(extensionConfig);
      console.log("Extension build complete.");
      await build(webviewConfig);
      console.log("Webview build complete.");
    }
  } catch (err) {
    console.error("Build failed:", err);
    process.exit(1);
  }
})();