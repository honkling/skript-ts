import type { Class } from "../lib/types";
import type { Skript } from "../skript";
import type { BlockContainer } from "../syntax/blockContainer";
import { Expression } from "../syntax/expression";

export class NumberExpression extends Expression<Number> {
    constructor(public value: number, skript: Skript) {
        super(skript);
    }

    public getReturnType(): Class<Number> {
        return Number;
    }

    public isSingle(): boolean {
        return true;
    }

    public get(): number[] {
        return [this.value];
    }

    public toString(container: BlockContainer): string {
        return this.value.toString();
    }
}