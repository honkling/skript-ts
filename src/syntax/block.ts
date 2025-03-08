import type { BlockContainer } from "./blockContainer";
import { Effect } from "./effect";
import type { Section } from "./section";

export class Block {
    constructor(public statements: Statement[]) {}

    public evaluate(container: BlockContainer) {
        for (const statement of this.statements) {
            if (statement instanceof Effect) {
                statement.execute(container);
                continue;
            }

            statement as Section;
            statement.block!.evaluate(container);
        }
    }
}

export type Statement = Effect | Section;