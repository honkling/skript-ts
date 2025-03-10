import type { Logger } from "../lib/logger";
import { Result } from "../lib/result";
import type { Skript } from "../skript";
import { Block, type Statement } from "../syntax/block";
import { Effect } from "../syntax/effect";
import { SyntaxType } from "../syntax/element";
import { Section } from "../syntax/section";
import { Structure } from "../syntax/structure";
import { Location } from "./location";
import { LocationProxyLogger } from "./logger";
import { Script } from "./script";

export class SkriptParser {
    public logger: LocationProxyLogger;
    public location: Location;

    constructor(
        public skript: Skript,
        public input: string,
        logger: Logger
    ) {
        this.location = new Location(input);
        this.logger = new LocationProxyLogger(logger, this.location);
    }
    
    public parse(scriptMode: boolean = false): Script {
        const structures = [];

        while (this.location.peekInput().trim() !== "") {
            const result = this.parseStructure();

            if (result.isFailure()) {
                if (!scriptMode) {
                    this.logger.error(result.getError().message);
                    this.location.advanceLine();
                    this.skipBlock(this.detectIndentation(), 1);
                    continue;
                }

                // this.getEffect()
                this.logger.error("Script mode is not implemented.");
                continue;
            }

            const structure = result.getValue();

            if (this.location.peek() !== ":") {
                this.logger.error("Expected ':' after structure");
                this.location.advanceLine();
                this.skipBlock(this.detectIndentation(), 1);
                continue;
            }

            this.location.advance();
            if (this.location.peek() !== "\n") {
                this.logger.error("Expected new line after ':'");
                this.location.advanceLine();
                this.skipBlock(this.detectIndentation(), 1);
                continue;
            }

            this.location.advance();
            const indentation = this.detectIndentation();
            const blockResult = this.parseBlock(indentation);

            if (blockResult.isFailure())
                continue;

            structure.block = blockResult.getValue();
            structures.push(structure);
        }

        return new Script(structures);
    }

    public parseBlock(indentation: string, expectedCount: number = 1): Result<Block> {
        const block = new Block([]);
        this.location.pushSnap();
        this.location.snap();

        while (this.location.hasInput()) {
            this.location.pushSnap();
            const count = this.detectIndentationCount(indentation);

            if (count === 0)
                break;

            if (expectedCount !== count) {
                this.location.snap();
                const expected = this.displayIndentation(indentation);
                const real = this.displayIndentation(this.detectIndentation());
                this.logger.error(`Invalid indentation; expected '${expected}', found '${real}'`);
                this.location.advanceLine();
                continue;
            } else this.location.popSnap();

            const match = this.parseStatement(indentation, expectedCount);

            if (match.isFailure()) {
                this.logger.error(match.getError().message);
                continue;
            }

            block.statements.push(match.getValue());
        }

        return Result.success(block);
    }

    public parseStatement(indentation: string, expectedCount: number): Result<Statement> {
        const input = this.location.peekInput();
        const registrations = [
            ...this.skript.getSyntaxOfType(SyntaxType.Effect),
            ...this.skript.getSyntaxOfType(SyntaxType.Section),
        ];

        for (const registration of registrations) {
            const match = registration.matchPattern(input, { skript: this.skript });

            if (!match)
                continue;

            this.location.advance(match.size);
            const element = registration.initialize(this.skript, match) as Statement;

            if (element instanceof Section) {
                if (this.location.peek() !== ":") {
                    this.logger.error("Expected ':' after section");
                    this.location.advanceLine();
                    this.skipBlock(indentation,  expectedCount + 1);
                } else {
                    this.location.advance();
                    const blockMatch = this.parseBlock(indentation, expectedCount + 1);
                    
                    if (blockMatch.isSuccess())
                        element.block = blockMatch.getValue();
                }
            } else this.location.advanceLine();

            return Result.success<Statement>(element);
        }

        if (this.location.peekLine().endsWith(":")) {
            this.location.advanceLine();
            this.skipBlock(indentation, expectedCount + 1);
        } else this.location.advanceLine();

        return Result.failure<Statement>(new Error("Unrecognized effect or section"));
    }

    public parseStructure(): Result<Structure> {
        const registrations = this.skript.getSyntaxOfType<Structure>(SyntaxType.Structure);
        const input = this.location.peekInput();

        for (const registration of registrations) {
            const match = registration.matchPattern(input, { skript: this.skript });

            if (!match)
                continue;

            this.location.advance(match.size);
            return Result.success(registration.initialize(this.skript, match));
        }

        return Result.failure(new Error("Unrecognized structure"));
    }

    public skipBlock(indentation: string, minCount: number) {
        while (this.location.hasInput()) {
            const count = this.detectIndentationCount(indentation);

            if (count >= minCount)
                this.location.advanceLine();
        }
    }

    public detectIndentation(): string {
        this.location.pushSnap();
        let indentation = "";

        let character: string;
        while (this.location.hasInput() && ((character = this.location.peek()) === " " || character === "\t")) {
            indentation += character;
            this.location.advance();
        }

        this.location.snap();
        return indentation;
    }

    public detectIndentationCount(indentation: string): number {
        let count = 0;

        while (this.location.peekInput().startsWith(indentation)) {
            this.location.advance(indentation.length);
            count++;
        }

        let character: string;
        if ((character = this.location.peek()) === " " || character === "\t") {
            const expectedFriendly = this.displayIndentation(indentation);
            const realFriendly = this.displayIndentation(this.detectIndentation());
            this.logger.error(`Indentation is inconsistent; expected '${expectedFriendly}', found '${realFriendly}'`);
        }

        return count;
    }

    public displayIndentation(indentation: string): string {
        return indentation
            .replace(/ /g, "s")
            .replace(/\t/g, "t");
    }
}