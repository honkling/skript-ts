import { ChangeMode } from "../core/syntax/effect/modify";
import type { Class } from "../lib/types";
import { ExpressionElement } from "../pattern/element/expression";
import type { Skript } from "../skript";
import type { BlockContainer } from "../syntax/blockContainer";
import { Expression } from "../syntax/expression";

export class VariableExpression extends Expression<any> {
    public cachedName: string | null = null;

    constructor(public name: string, skript: Skript) {
        super(skript);
    }

    public getReturnType(): Class<any> {
        return Object;
    }

    public isSingle(): boolean {
        return true;
    }

    public get(container: BlockContainer): any[] {
        const name = this.getName(container);
        return [container.structure!.symbols.get(name)]
    }

    public change(mode: ChangeMode, container: BlockContainer, expression: Expression<unknown> | null): void {
        const { symbols } = container.structure!;
        const name = this.cachedName!;

        switch (mode) {
            case ChangeMode.Set: {
                symbols.set(name, expression!.get(container));
                break;
            }
            case ChangeMode.Add:
            case ChangeMode.Subtract: {
                const value = expression!.get(container) as any[];
                const expr = expression!.get(container);

                const method = mode === ChangeMode.Add ? value.push : (...elements: any[]) => {
                    for (const element of elements) {
                        const index = value.indexOf(element);

                        if (index === -1)
                            continue;

                        value.splice(index, 1);
                    }
                }

                if (Array.isArray(expr))
                    method(...expr.flat());
                else method(expr);
                
                break;
            }
            case ChangeMode.Delete: {
                symbols.delete(name);
                break;
            }
        }
    }

    public acceptChange(mode: ChangeMode, container: BlockContainer, expression: Expression<unknown> | null): boolean {
        const name = this.getName(container);
        const value = container.structure!.symbols.get(name);

        if ((mode === ChangeMode.Add || mode === ChangeMode.Subtract) && !Array.isArray(value))
            return false;

        this.cachedName = name;
        return true;
    }

    public toString(container: BlockContainer): string {
        const value = container.structure!.symbols.get(this.name);
        const type = this.skript.types.getType(value.constructor);
        return type.toString(value);
    }

    private getName(container: BlockContainer): string {
        const objectType = this.skript.types.getType(Object);
        let index = 0;
        let name = "";

        while (index < this.name.length) {
            const character = this.name[index++];
        
            if (character === "%") {
                if (this.name[index] === "%") {
                    name += "%";
                    index++;
                    continue;
                }

                const expression = new ExpressionElement(objectType);
                const match = expression.matchPattern(this.name.substring(index), { skript: this.skript });
                name += match!.expressions[0].toString(container);

                if (this.name[index++] !== "%")
                    throw new Error("Expected '%'");

                continue;
            }

            name += character;
        }

        return name;
    }
}