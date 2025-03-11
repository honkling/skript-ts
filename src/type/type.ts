import type { Class } from "../lib/types";

type ToString<T> = (value: T) => string;
type Change<T> = (currentValue: T, mode: skriptWeb.ChangeMode, container: skriptWeb.BlockContainer, expression: skriptWeb.Expression<T> | null) => void;
type AcceptChange<T> = (mode: skriptWeb.ChangeMode, container: skriptWeb.BlockContainer, expression: skriptWeb.Expression<T> | null) => boolean;

export class Type<T> {
    public toString: ToString<T> = this.defaultToString;
    public change: Change<T> = this.defaultChange;
    public acceptChange: AcceptChange<T> = this.defaultAcceptChange;

    constructor(public type: Class<T>, public ids: string[]) {}

    public setToString(block: ToString<T>): Type<T> {
        this.toString = block;
        return this;
    }

    public setChange(block: Change<T>): Type<T> {
        this.change = block;
        return this;
    }

    public setAcceptChange(block: AcceptChange<T>): Type<T> {
        this.acceptChange = block;
        return this;
    }

    private defaultToString(value: T) {
        return (value as Object).toString();
    }

    public defaultChange(currentValue: T, mode: skriptWeb.ChangeMode, container: skriptWeb.BlockContainer, expression: skriptWeb.Expression<T> | null) {}
    public defaultAcceptChange(mode: skriptWeb.ChangeMode, container: skriptWeb.BlockContainer, expression: skriptWeb.Expression<T> | null): boolean {
        return false;
    }
}