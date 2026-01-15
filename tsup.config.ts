import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"], // your main entry
  format: ["cjs", "esm"], // CommonJS + ESM
  dts: true, // generate .d.ts
  minify: true,
  clean: true, // clean dist folder before build
  sourcemap: true, // optional but recommended
  loader: {
    ".css": "copy", // copy CSS file to dist
  },
  outDir: "dist",
});
