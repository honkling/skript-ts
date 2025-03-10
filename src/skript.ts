import { ExtensionRegistry } from "./registry/extension";
import type { SyntaxRegistration } from "./registry/syntax";
import { Types } from "./registry/types";
import type { SyntaxElement, SyntaxType } from "./syntax/element";

export class Skript {
    public extensions = new ExtensionRegistry(this);
    public types = new Types();

    public getSyntaxOfType<T extends SyntaxElement>(type: SyntaxType): SyntaxRegistration<T>[] {
        return this.extensions.getExtensions()
            .map((ext) => ext.syntaxRegistry.getSyntaxOfType<T>(type))
            .flat();
    }
}