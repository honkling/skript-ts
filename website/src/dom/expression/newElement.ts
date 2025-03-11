import type { Class, Skript, MatchPatternResult } from "../../../../src";

export class NewElement extends skriptWeb.Expression<Element> {
    public static Registration = class extends skriptWeb.SyntaxRegistration<NewElement> {
        public rawPatterns(): string[] {
            return ["[new] element (with|of) type %string%"];
        }

        public syntaxElement(): Class<NewElement> {
            return NewElement;
        }

        public initialize(skript: Skript, match: InstanceType<typeof skriptWeb.MatchPatternResult>): NewElement {
            const type = match.expressions[0] as skriptWeb.Expression<string>;
            return new NewElement(skript, type);
        }
    }

    constructor(skript: skriptWeb.Skript, public type: skriptWeb.Expression<string>) {
        super(skript);
    }

    public getReturnType(): skriptWeb.Class<Element> {
        return Element;
    }

    public isSingle(): boolean {
        return true;
    }

    public get(container: skriptWeb.BlockContainer): Element[] {
        const type = this.type.get(container)[0];
        return [document.createElement(type)];
    }

    public toString(container: skriptWeb.BlockContainer): string {
        const type = this.type.get(container)[0];
        return `new element of type ${type}`;
    }
}