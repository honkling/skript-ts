import type { Class } from "../lib/types";

export class Type<T> {
    public toString: (value: T) => string = this.defaultToString;

    constructor(public type: Class<T>, public ids: string[]) {}

    public setToString(block: (value: T) => string) {
        this.toString = block;
    }

    private defaultToString(value: T) {
        return (value as Object).toString();
    }
}