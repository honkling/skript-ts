import { haltCharacters, MatchPatternResult, type CreatePatternResult, type PatternElement } from "./element";

export class LiteralElement implements PatternElement {
    constructor(public value: string) {}

    public createPattern(input: string): CreatePatternResult {
        let value = "";
        let index = 0;
        
        while (index < input.length && !haltCharacters.includes(input[index]))
            value += input[index++];

        return [new LiteralElement(value.trim()), index];
    }

    public matchPattern(input: string): MatchPatternResult | null {
        if (!input.startsWith(this.value))
            return null;

        return new MatchPatternResult(this.value.length, []);
    }
}