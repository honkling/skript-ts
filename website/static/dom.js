import { Expression, SkriptExtension, SyntaxRegistration } from "./skript.js";

class ExprNewElement extends Expression {
    static Registration = class extends SyntaxRegistration {
        rawPatterns() {
            return ["[new] element (with|of) type %string%"];
        }

        syntaxElement() {
            return ExprNewElement;
        }

        initialize(skript, match) {
            const type = match.expressions[0];
            return new ExprNewElement(skript, type);
        }
    }

    type;

    constructor(skript, type) {
        super(skript);
        this.type = type;
    }

    isSingle() {
        return true;
    }

    get() {
        console.log(this.type)
        const type = this.type.get()[0];
        const element = document.createElement(type);
        return [element];
    }

    getReturnType() {
        return Element;
    }

    toString(container) {
        return `new element of type ${this.type}`;
    }
}

export class DOMExtension extends SkriptExtension {
    name = "dom";

    onInitialize() {
        const { syntaxRegistry: syntax } = this;
        syntax.registerSyntaxElement(new ExprNewElement.Registration(this.skript));
    }
}