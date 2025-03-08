import type { ExtensionConstructor, SkriptExtension } from "../extension/extension";
import type { Skript } from "../skript";

export class ExtensionRegistry {
    private extensions = new Map<ExtensionConstructor, SkriptExtension>();

    constructor(private skript: Skript) {}

    public registerExtension(constructor: ExtensionConstructor) {
        const extension = new constructor(this.skript);
        this.extensions.set(constructor, extension);
        extension.initialize();
    }

    public getExtension(constructor: ExtensionConstructor): SkriptExtension {
        return this.extensions.get(constructor)!;
    }

    public getExtensions(): SkriptExtension[] {
        return Array.from(this.extensions.values());
    }
}