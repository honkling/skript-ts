import { SkriptExtension } from "../extension/extension";
import { ModifyEffect } from "./syntax/effect/modify";
import { PrintEffect } from "./syntax/effect/print";
import { TestExpression } from "./syntax/expression/test";
import { ScriptLoadStructure } from "./syntax/structure/scriptLoad";

export class CoreExtension extends SkriptExtension {
    public name = "core";

    protected onInitialize(): void {
        const { syntaxRegistry: syntax } = this;
        syntax.registerSyntaxElement(new ModifyEffect.Registration(this.skript));
        syntax.registerSyntaxElement(new ScriptLoadStructure.Registration(this.skript));
        syntax.registerSyntaxElement(new PrintEffect.Registration(this.skript));
        syntax.registerSyntaxElement(new TestExpression.Registration(this.skript));
    }
}