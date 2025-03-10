import { BooleanExpression } from "../../literal/boolean";
import { Integer, IntegerExpression } from "../../literal/integer";
import { NumberExpression } from "../../literal/number";
import { StringExpression } from "../../literal/string";
import { VariableExpression } from "../../literal/variable";
import type { Types } from "../../registry/types";
import type { Skript } from "../../skript";
import { SyntaxType } from "../../syntax/element";
import { Expression } from "../../syntax/expression";
import type { Type } from "../../type/type";
import { MatchPatternResult, type CreatePatternResult, type PatternElement } from "./element";

export type ExpressionMetadata = { skript: Skript };
export class ExpressionElement implements PatternElement<ExpressionMetadata> {
    constructor(public type: Type<unknown>) {}

    public createPattern(input: string, { skript }: ExpressionMetadata): CreatePatternResult<ExpressionElement> {
        let match = "";
        let index = 0;

        if (input[index++] !== "%")
            throw new Error("Expected '%'");

        while (index < input.length && input[index] !== "%")
            match += input[index++];

        if (input[index++] !== "%")
            throw new Error("Expected '%'");

        return [new ExpressionElement(skript.types.getType(match)), index];
    }

    public matchPattern(input: string, { skript }: ExpressionMetadata): MatchPatternResult | null {
        const registrations = skript.getSyntaxOfType<Expression<unknown>>(SyntaxType.Expression);

        let index = 0;
        const isDigit = (char: string) => char >= "0" && char <= "9";
        switch (true) {
            case input[index] === "\"": {
                if (this.type.type !== String && this.type.type !== Object)
                    break;

                index++;
                let value = "";

                while (index < input.length && input[index] !== "\"") {
                    if (input[index] === "\\") {
                        index++;
                        value += input[index++];
                        continue;
                    }

                    value += input[index++];
                }

                if (input[index++] !== "\"")
                    break;

                return new MatchPatternResult(
                    index,
                    [],
                    [new StringExpression(value, skript)]
                );
            }
            case isDigit(input[index]): {
                if (!isDigit(input[index]))
                    break;

                let float = 0;
                let value = 0;
                while (index < input.length && isDigit(input[index]) || (float === 0 && input[index] === ".")) {
                    if (float === 0) {
                        if (input[index] === ".") {
                            float = 0.1;
                            continue;
                        }

                        value *= 10;
                        value += input.charCodeAt(index++) - 48;

                        continue;
                    }

                    value += (input.charCodeAt(index++) - 48) * float;
                    float /= 10;
                }

                const expression =
                    float === 0 && (this.type.type === Integer || this.type.type === Object)
                    ? new IntegerExpression(value, skript)
                    : new NumberExpression(value, skript);

                return new MatchPatternResult(
                    index,
                    [],
                    [expression]
                );
            }
            case input.startsWith("true") || input.startsWith("false"): {
                if (this.type.type !== Boolean && this.type.type !== Object)
                    break;

                const isTrue = input.startsWith("true");

                index += isTrue ? 4 : 5;
                if (index < input.length && (input[index] >= "a" && input[index] <= "z") || isDigit(input[index]))
                    break;

                return new MatchPatternResult(
                    index,
                    [],
                    [new BooleanExpression(isTrue, skript)]
                );
            }
        }

        if (input[index] === "{") {
            const objectType = skript.types.getType(Object);
            const expression = new ExpressionElement(objectType);
            let name = "";
            index++;

            while (index < input.length && input[index] !== "}" && input[index] !== "\n") {
                const character = input[index++];

                if (character === "%") {
                    if (input[index] === "%") {
                        name += "%";
                        index++;
                        continue;
                    }

                    const match = expression.matchPattern(input.substring(index), { skript });

                    if (!match)
                        return null;

                    for (let i = 0; i < match.size; i++)
                        name += input[index++];

                    if (input[index++] !== "%")
                        return null;

                    continue;
                }

                name += character;
            }

            if (input[index++] !== "}")
                return null;

            return new MatchPatternResult(
                index,
                [],
                [new VariableExpression(name, skript)]
            );
        }

        for (const registration of registrations) {
            const expression = registration.syntaxElement();

            if ((this.type.type !== Object && expression.prototype.getReturnType() !== this.type.type))
                continue;
            
            const matchResult = registration.matchPattern(input, { skript });

            if (!matchResult)
                continue;

            return new MatchPatternResult(
                matchResult.size,
                [],
                [registration.initialize(skript, matchResult)]
            );
        }

        return null;
    }
}