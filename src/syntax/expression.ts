import type { ChangeMode } from "../variable/changeMode";
import type { Class } from "../lib/types";
import type { BlockContainer } from "./blockContainer";
import { SyntaxElement, SyntaxType } from "./element";

export abstract class Expression<T> extends SyntaxElement {
    public abstract getReturnType(): Class<T>;
    public abstract isSingle(): boolean;
    public abstract get(container: BlockContainer): T[];
    public abstract toString(container: BlockContainer): string;

    public change(mode: ChangeMode, container: BlockContainer, expression: Expression<unknown> | null) {
        const values = this.get(container);
        const type = container.skript.types.findTypeFromValue(values[0]);
        type.change(this.isSingle() ? values[0] : values, mode, container, expression);
    }

    public acceptChange(mode: ChangeMode, container: BlockContainer, expression: Expression<unknown> | null): boolean {
        return true;
    }

    public getSyntaxType(): SyntaxType {
        return SyntaxType.Expression;
    }
}