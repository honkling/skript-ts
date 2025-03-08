import type { Class } from "../lib/types";
import type { Skript } from "../skript";
import type { BlockContainer } from "../syntax/blockContainer";
import { Expression } from "../syntax/expression";

export class StringExpression extends Expression<String> {
    constructor(public value: string, skript: Skript) {
        super(skript);
    }

    public getReturnType(): Class<String> {
        return String;
    }

    public isSingle(): boolean {
        return true;
    }

    public get(): string[] {
        return [this.value];
    }

    public toString(container: BlockContainer): string {
        return this.value;
    }
}