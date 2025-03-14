import type { Types } from "../../registry/types";
import type { Skript } from "../../skript";
import { ChoiceElement } from "./choice";
import { haltCharacters, MatchPatternResult, type CreatePatternResult, type PatternElement } from "./element";
import { ExpressionElement } from "./expression";
import { LiteralElement } from "./literal";
import { RegexElement } from "./regex";

export type GroupMetadata = { skript: Skript, patternNumber: number };
export class GroupElement implements PatternElement<GroupMetadata> {
    constructor(public elements: PatternElement[]) {}

    public createPattern(input: string, { skript }: GroupMetadata): CreatePatternResult {
        const elements: PatternElement[] = [];
        let index = 0;

        loop:while (index < input.length) {
            const newInput = input.substring(index);
            const character = newInput[0];

            if (newInput.startsWith(" ")) {
                index++;
                continue;
            }

            switch (character) {
                case "\\": {
                    index++;
                    const element = new LiteralElement(input[index++]);
                    elements.push(element);
                    break;
                }
                case "%": {
                    const [element, offset] = ExpressionElement.prototype.createPattern(newInput, { skript });
                    elements.push(element);
                    index += offset;
                    break;
                }
                case "(": {
                    const [element, offset] = ChoiceElement.prototype.createPattern(newInput, { skript, isOptional: false });
                    elements.push(element);
                    index += offset;
                    break;
                }
                case "[": {
                    const [element, offset] = ChoiceElement.prototype.createPattern(newInput, { skript, isOptional: true });
                    elements.push(element);
                    index += offset;
                    break;
                }
                case "<": {
                    const [element, offset] = RegexElement.prototype.createPattern(newInput);
                    elements.push(element);
                    index += offset;
                    break;
                }
                default: {
                    if (haltCharacters.includes(character))
                        break loop;

                    const [element, offset] = LiteralElement.prototype.createPattern(newInput);
                    elements.push(element);
                    index += offset;
                    break;
                }
            }
        }

        return [new GroupElement(elements), index];
    }

    public matchPattern(input: string, { skript, patternNumber = -1 }: GroupMetadata): MatchPatternResult | null {
        const expressions = [];
        const regexes = [];
        let index = 0;

        let match: MatchPatternResult | null;
        for (const element of this.elements) {
            const newInput = input.substring(index);

            switch (true) {
                case element instanceof ExpressionElement: {
                    match = element.matchPattern(newInput, { skript });
                    break;
                }
                case element instanceof ChoiceElement: {
                    match = element.matchPattern(newInput, { skript, isOptional: element.isOptional })
                    break;
                }
                default: {
                    match = element.matchPattern(newInput, {});
                    break;
                }
            }

            if (!match) {
                if (element instanceof ChoiceElement && element.isOptional)
                    continue;

                return null;
            }

            if (!(element instanceof ExpressionElement))
                regexes.push(...match.regexes);
            else expressions.push(...match.expressions);

            index += match.size;

            while (input.substring(index).startsWith(" "))
                index++;
        }

        return new MatchPatternResult(index, regexes, expressions, patternNumber);
    }

    public getKeywords(): string[] {
        return this.elements
            .filter((element) => element instanceof LiteralElement)
            .map((literal) => literal.value);
    }
}