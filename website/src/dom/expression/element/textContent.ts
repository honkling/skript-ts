import { BlockContainer, ChangeMode, Expression, MatchPatternResult, Skript, SyntaxRegistration, type Class } from "../../../../../src";

export class TextContent extends Expression<String> {
    public static Registration = class extends SyntaxRegistration<TextContent> {
        public rawPatterns(): string[] {
            return ["text [content] of %element%", "%element%'[s] text [content]"]
        }

        public syntaxElement(): Class<TextContent> {
            return TextContent;
        }

        public initialize(skript: Skript, match: InstanceType<typeof MatchPatternResult>): TextContent {
            return new TextContent(skript, match.expressions[0] as Expression<Element>);
        }
    }

    constructor(skript: Skript, public element: Expression<Element>) {
        super(skript);
    }

    public getReturnType(): Class<String> {
        return String;
    }

    public isSingle(): boolean {
        return true;
    }

    public get(container: BlockContainer): String[] {
        const element = this.element.get(container)[0];
        return [element.textContent!];
    }

    public acceptChange(mode: ChangeMode, container: BlockContainer, expression: Expression<unknown> | null): boolean {
        return true;
    }

    public change(mode: ChangeMode, container: BlockContainer, expression: Expression<string>): void {
        const element = this.element.get(container)[0];
        const value = expression.get(container)[0];

        switch (mode) {
            case ChangeMode.Set: {
                element.textContent = value;
                break;
            }
            case ChangeMode.Add: {
                element.textContent += value;
                break;
            }
            case ChangeMode.Subtract: {
                element.textContent = element.textContent?.replaceAll(value, "") ?? "";
                break;
            }
            case ChangeMode.Delete: {
                element.textContent = "";
                break;
            }
        }
    }

    public toString(container: BlockContainer): string {
        const element = this.element.get(container)[0];
        return `text content of ${element}`;
    }
}