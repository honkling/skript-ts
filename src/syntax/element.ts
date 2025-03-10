import type { Skript } from "../skript";

export abstract class SyntaxElement {
    constructor(public skript: Skript) {}

    public abstract getSyntaxType(): SyntaxType
}

export enum SyntaxType {
    Structure,
    Event,
    Effect,
    Expression,
    Condition,
    Section
}