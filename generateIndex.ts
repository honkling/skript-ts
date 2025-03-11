import { writeFileSync } from "fs";
import { glob } from "glob";

const blacklist = [
    "src/index.ts",
    "src/test.ts",
    "src/debug.ts"
];
const files = await glob("src/**/*.ts");
let result = "";

for (const file of files) {
    if (blacklist.includes(file.replace(/\\/g, "/")))
        continue;

    const name = "./" + file.substring("src/".length, file.length - ".ts".length).replace(/\\/g, "/");
    result += `export * from "${name}";\n`;
}

writeFileSync("src/index.ts", result);
// writeFileSync("website/src/globals.d.ts", `namespace skriptWeb {\n\t${result.replace(/"\.\//g, "\"../../src/").split("\n").join("\n\t").trimEnd()}\n}`);