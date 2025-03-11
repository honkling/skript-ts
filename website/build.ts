import { build } from "esbuild";

await build({
    entryPoints: ["src/index.ts"],
    format: "esm",
    bundle: true,
    minify: true,
    keepNames: true,
    target: ["firefox116"],
    outfile: "static/index.js"
});