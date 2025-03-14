import { DOMExtension } from "./dom/extension";

const { Skript, CoreExtension, SimpleLogger, SkriptParser, LogLevel } = skriptWeb;
const skript = new Skript();

skript.types.registerType(Object, "object", "objects");
skript.types.registerType(String, "string", "strings");
skript.types.registerType(Number, "number", "numbers");
skript.types.registerType(Boolean, "boolean", "booleans");
skript.extensions.registerExtension(CoreExtension);
skript.extensions.registerExtension(DOMExtension);

(async () => {
    const response = await fetch("/index.sk");
    const input = (await response.text()).replace(/\r\n/g, "\n");

    console.log(input);
    
    const logger = new SimpleLogger();
    const parser = new SkriptParser(skript, input, logger);
    const script = parser.parse();
    
    for (const { level, message } of logger.entries) {
        console.log(`${LogLevel[level]}: ${message}`);
    }
    
    for (const structure of script.structures)
        structure.postLoad();
})();