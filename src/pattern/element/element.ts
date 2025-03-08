import type { Expression } from "../../syntax/expression";

export type CreatePatternResult<T extends PatternElement = PatternElement<unknown>> = [T, number];
export class MatchPatternResult {
    constructor(
        public size: number,
        public regexes: string[] = [],
        public expressions: Expression<unknown>[] = [],
        public patternNumber: number = -1
    ) {}
}

export abstract class PatternElement<T = {}> {
    public abstract createPattern(input: string, metadata: T): CreatePatternResult;
    public abstract matchPattern(input: string, metadata: T): MatchPatternResult | null;
}

export const haltCharacters = ["(", ")", "[", "]", "<", "%", "|"];