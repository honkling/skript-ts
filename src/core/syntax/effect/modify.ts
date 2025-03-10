import type { Class } from "../../../lib/types";
import type { MatchPatternResult } from "../../../pattern/element/element";
import { Effect } from "../../../syntax/effect";
import type { Skript } from "../../../skript";
import type { BlockContainer } from "../../../syntax/blockContainer";
import type { Expression } from "../../../syntax/expression";
import { SyntaxRegistration } from "../../../registry/syntax";
import { ChangeMode } from "../../../variable/changeMode";

export class ModifyEffect extends Effect {
    public static Registration = class extends SyntaxRegistration<ModifyEffect> {
        public rawPatterns(): string[] {
            return [
                "set %objects% to %objects%",
                "(give|add) %objects% to %objects%",
                "(remove|subtract) %objects% from %objects%",
                "delete %objects%"
            ]
        }

        public syntaxElement(): Class<ModifyEffect> {
            return ModifyEffect;
        }

        public initialize(skript: Skript, { expressions, patternNumber }: MatchPatternResult): ModifyEffect {
            let changing: Expression<any>,
                changeWith: Expression<any> | null = null;

            switch (patternNumber) {
                case ChangeMode.Set: {
                    changing = expressions[0];
                    changeWith = expressions[1];
                    break;
                }
                case ChangeMode.Add:
                case ChangeMode.Subtract: {
                    changing = expressions[1];
                    changeWith = expressions[0];
                    break;
                }
                case ChangeMode.Delete: {
                    changing = expressions[0];
                    break;
                }
                default: {
                    throw new Error(`Invalid change mode ${patternNumber}`);
                }
            }

            return new ModifyEffect(
                patternNumber as ChangeMode,
                changing,
                changeWith,
                skript
            );
        }
    }

    constructor(
        public mode: ChangeMode,
        public changing: Expression<any>,
        public changeWith: Expression<any> | null,
        skript: Skript
    ) {
        super(skript);
    }

    public execute(container: BlockContainer): void {
        this.changing.change(this.mode, container, this.changeWith);
    }
}