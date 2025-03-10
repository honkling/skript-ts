import type { Class } from "../../../lib/types";
import type { MatchPatternResult } from "../../../pattern/element/element";
import { SyntaxRegistration } from "../../../registry/syntax";
import type { Skript } from "../../../skript";
import { Structure } from "../../../syntax/structure";

export class ScriptLoadStructure extends Structure {
    public static Registration = class extends SyntaxRegistration<ScriptLoadStructure> {
        public rawPatterns(): string[] {
            return ["[on] script load"];
        }

        public syntaxElement(): Class<ScriptLoadStructure> {
            return ScriptLoadStructure;
        }

        public initialize(skript: Skript, match: MatchPatternResult): ScriptLoadStructure {
            return new ScriptLoadStructure(skript);
        }
    }

    public postLoad(): void {
        this.trigger();
    }
}