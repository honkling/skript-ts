import { BlockContainer, Expression, MatchPatternResult, Skript, SyntaxRegistration, type Class } from "../../../../../src";

export class JSXElement extends Expression<Element> {
    public static Registration = class extends SyntaxRegistration<JSXElement> {
        public rawPatterns(): string[] {
            return ["\\<<[^\\>]+>\\>[%element%|%string%]\\</<[^\\>]+>\\>"]
        }

        public syntaxElement(): Class<JSXElement> {
            return JSXElement;
        }

        public initialize(skript: Skript, match: InstanceType<typeof MatchPatternResult>): JSXElement {
            const [start, end] = match.regexes;

            if (start !== end)
                throw new Error(`Opening and closing tags don't match (<${start}>...</${end}>)`);

            const child = match.expressions.length === 0 ? undefined : match.expressions[0] as Expression<Element> | Expression<string>;
            return new JSXElement(skript, start, child);
        }
    }

    constructor(skript: Skript, public type: string, public child: Expression<Element> | Expression<string> | undefined) {
        super(skript);
    }

    public getReturnType(): Class<Element> {
        return Element;
    }

    public isSingle(): boolean {
        return true;
    }

    public get(container: BlockContainer): Element[] {
        const element = document.createElement(this.type);
        const child = this.child?.get(container)[0];

        if (child)
            if (typeof child === "string")
                element.textContent = child;
            else element.appendChild(child);

        return [element];
    }

    public toString(container: BlockContainer): string {
        const child = this.child?.get(container)[0] ?? "";
        return `<${this.type}>${child}</${this.type}>`;
    }
}