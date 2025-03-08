console.log("Loading " + __filename);
import type { Class } from "../lib/types";
import type { MatchPatternResult } from "../pattern/element/element";
console.log("Loading pattern")
import { Pattern } from "../pattern/pattern";
console.log("Loaded pattern");
import type { Skript } from "../skript";
import { SyntaxElement, SyntaxType } from "../syntax/element";
console.log("Loaded syntaxelement");

export class SyntaxRegistry {
    private syntax = new Map<SyntaxType, SyntaxRegistration<SyntaxElement>[]>();

    public registerSyntaxElement(registration: SyntaxRegistration<SyntaxElement>) {
        const type = (registration.syntaxElement().prototype as SyntaxElement).getSyntaxType();

        if (!this.syntax.has(type))
            this.syntax.set(type, []);

        const syntaxList = this.syntax.get(type)!;
        syntaxList.push(registration);
    }

    public getSyntaxOfType<T extends SyntaxElement>(type: SyntaxType): SyntaxRegistration<T>[] {
        return (this.syntax.get(type) ?? []) as SyntaxRegistration<T>[];
    }
}

export abstract class SyntaxRegistration<T extends SyntaxElement> {
    public patterns: Pattern[];

    constructor(skript: Skript) {
        this.patterns = this.rawPatterns()
            .map((r) => new Pattern(skript, r));
    }

    public matchPattern(input: string, { skript }: { skript: Skript }): MatchPatternResult | null {
        for (const [index, { compiledPattern: pattern }] of Object.entries(this.patterns)) {
            if (pattern.getKeywords().find((keyword) => !input.includes(keyword)))
                continue;
            
            const match = pattern.matchPattern(input, { skript, patternNumber: parseInt(index) });

            if (match)
                return match;
        }

        return null;
    }

    public abstract rawPatterns(): string[];
    public abstract syntaxElement(): Class<T>;
    public abstract initialize(skript: Skript, match: MatchPatternResult): T;
}