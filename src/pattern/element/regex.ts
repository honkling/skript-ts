import { MatchPatternResult, type CreatePatternResult, type PatternElement } from "./element";

export class RegexElement implements PatternElement {
    constructor(public regex: RegExp) {}

    public createPattern(input: string): CreatePatternResult {
        let match = "^";
        let index = 0;

        if (input[index++] !== "<")
            throw new Error("Expected '<'");

        while (index < input.length && input[index] !== ">") {
            const character = input[index++];

            if (character === "\\" && input[index] === ">") {
                match += ">";
                index++;
                continue;
            }

            match += character;
        }

        if (input[index++] !== ">")
            throw new Error("Expected '>'");

        return [new RegexElement(new RegExp(match, "g")), index];
    }

    public matchPattern(input: string): MatchPatternResult | null {
        const match = input.match(this.regex);

        if (!match)
            return null;

        return new MatchPatternResult(match[0].length, [match[0]]);
    }
}