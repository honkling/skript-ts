import type { Class } from "../../../lib/types";
import type { MatchPatternResult } from "../../../pattern/element/element";
import { SyntaxRegistration } from "../../../registry/syntax";
import type { Skript } from "../../../skript";
import type { BlockContainer } from "../../../syntax/blockContainer";
import { Effect } from "../../../syntax/effect";
import type { Expression } from "../../../syntax/expression";

export class PrintEffect extends Effect {
    public static Registration = class extends SyntaxRegistration<PrintEffect> {
        public rawPatterns(): string[] {
            return ["print %objects% [to console]"];
        }

        public syntaxElement(): Class<PrintEffect> {
            return PrintEffect;
        }

        public initialize(skript: Skript, match: MatchPatternResult): PrintEffect {
            return new PrintEffect(match.expressions[0], skript);
        }
    }

    constructor(public expression: Expression<any>, skript: Skript) {
        super(skript);
    }

    public execute(container: BlockContainer): void {
        for (const value of this.expression.get(container))
            console.log(value);
    }
}