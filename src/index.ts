console.log("Hello via Bun!")

import { CoreExtension } from "./core/core";
import { LogLevel, SimpleLogger } from "./lib/logger";
import { SkriptParser } from "./parser/parser";
import { Pattern } from "./pattern/pattern";
import { Skript } from "./skript";

console.log("Hello via Bun!");
const skript = new Skript();

console.log("Registering types...");
skript.types.registerType(Object, "object", "objects");
skript.types.registerType(String, "string", "strings");
skript.types.registerType(Number, "number", "numbers");
skript.types.registerType(Boolean, "boolean", "booleans");
skript.extensions.registerExtension(CoreExtension);

console.log("Parsing...");
const input = `
on script load:
    set {_a} to "hello"
    print {_a} to console
`.trim();

console.log("Debugging")
debugger;

const logger = new SimpleLogger();
const parser = new SkriptParser(skript, input, logger);
const script = parser.parse();

for (const { level, message } of logger.entries) {
    console.log(`${LogLevel[level]}: ${message}`);
}

for (const structure of script.structures)
    structure.postLoad();