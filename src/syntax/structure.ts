import type { Skript } from "../skript";
import { BlockContainer } from "./blockContainer";
import { SyntaxType } from "./element";

export abstract class Structure extends BlockContainer {
    public symbols = new Map<string, any>();

    constructor(skript: Skript) {
        super(skript);
        this.structure = this;
        this.preLoad();
    }

    public preLoad() {}
    public postLoad() {}

    public getSyntaxType(): SyntaxType {
        return SyntaxType.Structure;
    }
}