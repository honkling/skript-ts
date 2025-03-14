import { ChangeMode } from "../../../src";
import { Document } from "./expression/document";
import { TextContent } from "./expression/element/textContent";
import { JSXElement } from "./expression/jsx/jsxElement";
import { NewElement } from "./expression/newElement";

export class DOMExtension extends skriptWeb.SkriptExtension {
    public name = "dom";

    protected onInitialize() {
        const { syntaxRegistry: syntax, skript } = this;

        skript.types.registerType(Element, "element", "elements")
            .setAcceptChange((_, __, expression) => expression?.isSingle() === true)
            .setChange((currentValue, mode, container, expression) => {
                const parent = currentValue.parentElement;
                const value = expression!.get(container)[0];

                console.log(expression);
                console.log("Adding", value, "to", currentValue);
                console.log(expression!.get(container));

                switch (mode) {
                    case ChangeMode.Set: {
                        if (!parent)
                            return;

                        const children = Array.from(parent.children);
                        const index = Array.from(parent.children).indexOf(currentValue);
                        parent.replaceChildren(...children.slice(0, index), value, ...children.slice(index + 1));

                        break;
                    }
                    case ChangeMode.Add: {
                        currentValue.appendChild(value);
                        break;
                    }
                    case ChangeMode.Subtract: {
                        currentValue.removeChild(value);
                        break;
                    }
                    case ChangeMode.Delete: {
                        if (!parent)
                            return;

                        parent.removeChild(currentValue);
                        break;
                    }
                }
            });

        syntax.registerSyntaxElement(new TextContent.Registration(skript));
        syntax.registerSyntaxElement(new NewElement.Registration(skript));
        syntax.registerSyntaxElement(new Document.Registration(skript));
        syntax.registerSyntaxElement(new JSXElement.Registration(skript));
    }
}