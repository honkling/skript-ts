import type { Types } from "../../registry/types";
import type { Skript } from "../../skript";
import type { CreatePatternResult, MatchPatternResult, PatternElement } from "./element";
import { GroupElement } from "./group";

export type ChoiceMetadata = { skript: Skript, isOptional: boolean };
export class ChoiceElement implements PatternElement<ChoiceMetadata> {
    constructor(public element: GroupElement[], public isOptional: boolean) {}

    public createPattern(input: string, { skript, isOptional }: ChoiceMetadata): CreatePatternResult {
        const [start, end] = [
            ["(", ")"],
            ["[", "]"]
        ][+isOptional];
        let index = 0;

        if (input[index++] !== start)
            throw new Error(`Expected '${start}'`);

        const choices: GroupElement[] = [];

        while (input[index] !== end) {
            const [group, offset] = GroupElement.prototype.createPattern(input.substring(index), { skript });
            choices.push(group as GroupElement);
            index += offset;

            if (input[index] === "|")
                index++;
        }

        if (input[index++] !== end)
            throw new Error(`Expected '${end}'`);

        return [new ChoiceElement(choices, isOptional), index];
    }

    public matchPattern(input: string, { skript }: ChoiceMetadata): MatchPatternResult | null {
        for (const group of this.element) {
            const match = group.matchPattern(input, { skript });

            if (match)
                return match;
        }

        return null;
    }
}