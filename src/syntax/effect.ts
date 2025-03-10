import type { BlockContainer } from "./blockContainer";
import { SyntaxElement, SyntaxType } from "./element";

export abstract class Effect extends SyntaxElement {
    public abstract execute(container: BlockContainer): void
    
    public getSyntaxType(): SyntaxType {
        return SyntaxType.Effect
    }
}