import type { Block } from "./block";
import { SyntaxElement } from "./element";
import type { Structure } from "./structure";

export abstract class BlockContainer extends SyntaxElement {
    public structure: Structure | null = null;
    public block: Block | null = null;

    public trigger() {
        this.block!.evaluate(this);
    }
}