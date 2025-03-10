import { writeFileSync } from "fs";
import { glob } from "glob";

const files = await glob("src/**/*.ts");
let result = "";

for (const file of files) {
    if (file === "src/index.ts")
        continue;

    const name = "./" + file.substring("src/".length, file.length - ".ts".length);
    result += `export * from "${name}";\n`;
}

writeFileSync("src/index.ts", result);