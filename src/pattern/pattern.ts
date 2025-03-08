import type { Skript } from "../skript";
import { GroupElement } from "./element/group";

export class Pattern {
    public compiledPattern: GroupElement;

    constructor(skript: Skript, public pattern: string) {
        this.compiledPattern = GroupElement.prototype.createPattern(this.pattern, { skript, patternNumber: -1 })[0] as GroupElement;
    }
}