import type { Class, Skript } from "../../../../src";

export class Document extends skriptWeb.Expression<Element> {
    public static Registration = class extends skriptWeb.SyntaxRegistration<Document> {
        public rawPatterns(): string[] {
            return ["document body"];
        }

        public syntaxElement(): Class<Document> {
            return Document;
        }

        public initialize(skript: Skript, match: InstanceType<typeof skriptWeb.MatchPatternResult>): Document {
            return new Document(skript);
        }
    }

    public getReturnType(): skriptWeb.Class<Element> {
        return Element;
    }

    public isSingle(): boolean {
        return true;
    }

    public get(container: skriptWeb.BlockContainer): Element[] {
        return [document.body];
    }

    public toString(container: skriptWeb.BlockContainer): string {
        return `document body`;
    }
}