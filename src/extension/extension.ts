import { SyntaxRegistry } from "../registry/syntax";
import type { Skript } from "../skript";

export type ExtensionConstructor = { new(skript: Skript): SkriptExtension };
export abstract class SkriptExtension {
    private isInitialized = false;
    public syntaxRegistry = new SyntaxRegistry();
    public abstract name: string;

    constructor(public skript: Skript) {}

    protected abstract onInitialize(): void;

    public initialize() {
        if (this.isInitialized)
            throw new Error(`Extension '${this.name}' has already been initialized.`);

        this.isInitialized = true;
        this.onInitialize();
    }
}