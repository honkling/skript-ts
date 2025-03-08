import type { Class } from "../lib/types";
import type { Skript } from "../skript";
import type { BlockContainer } from "../syntax/blockContainer";
import { Expression } from "../syntax/expression";

export class BooleanExpression extends Expression<Boolean> {
    constructor(public value: boolean, skript: Skript) {
        super(skript);
    }

    public getReturnType(): Class<Boolean> {
        return Boolean;
    }

    public isSingle(): boolean {
        return true;
    }

    public get(): boolean[] {
        return [this.value];
    }

    public toString(container: BlockContainer): string {
        return this.value.toString();
    }
}