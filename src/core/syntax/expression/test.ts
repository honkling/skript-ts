import type { Class } from "../../../lib/types";
import type { MatchPatternResult } from "../../../pattern/element/element";
import { SyntaxRegistration } from "../../../registry/syntax";
import type { Skript } from "../../../skript";
import type { BlockContainer } from "../../../syntax/blockContainer";
import { Expression } from "../../../syntax/expression";

export class TestExpression extends Expression<String> {
    public static Registration = class extends SyntaxRegistration<TestExpression> {
        public rawPatterns(): string[] {
            return ["test expr"];
        }

        public syntaxElement(): Class<TestExpression> {
            return TestExpression;
        }

        public initialize(skript: Skript, _match: MatchPatternResult): TestExpression {
            return new TestExpression(skript);
        }
    }

    public isSingle(): boolean {
        return true;
    }

    public get(): string[] {
        return ["hello world"];
    }

    public getReturnType(): Class<String> {
        return String;
    }

    public toString(container: BlockContainer): string {
        return "test expression";
    }
}