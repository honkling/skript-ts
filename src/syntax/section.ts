import type { Skript } from "../skript";
import type { Block } from "./block";
import { BlockContainer } from "./blockContainer";
import { SyntaxType } from "./element";
import type { Structure } from "./structure";

export abstract class Section extends BlockContainer {
    constructor(public parent: BlockContainer, skript: Skript) {
        super(skript);
        this.structure = parent.structure;
    }

    public abstract execute(container: BlockContainer): SectionAction;
    
    public walk(container: BlockContainer) {

    }

    public getSyntaxType(): SyntaxType {
        return SyntaxType.Section;
    }
}

export enum SectionAction {
    Execute,
    Skip
}