import { build } from "esbuild";

await build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    minify: true,
    keepNames: true,
    globalName: "skriptWeb",
    format: "iife",
    platform: "browser",
    target: ["firefox116"],
    outfile: "website/static/skript.js"
});