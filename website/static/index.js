import { DOMExtension } from "./dom.js";
import { Skript, SkriptParser, LogLevel, SimpleLogger, CoreExtension } from "/skript.js";

const skript = new Skript();

skript.types.registerType(Object, "object", "objects");
skript.types.registerType(String, "string", "strings");
skript.types.registerType(Number, "number", "numbers");
skript.types.registerType(Boolean, "boolean", "booleans");
skript.extensions.registerExtension(CoreExtension);
skript.extensions.registerExtension(DOMExtension);

const input = `
on script load:
    set {_a} to new element of type "div"
    print {_a} to console
`.trim();

const logger = new SimpleLogger();
const parser = new SkriptParser(skript, input, logger);
const script = parser.parse();

for (const { level, message } of logger.entries) {
    console.log(`${LogLevel[level]}: ${message}`);
}

for (const structure of script.structures)
    structure.postLoad();