export class Location {
    public index = 0;
    public line = 0;
    public column = 1;
    public snapStack: [number, number, number][] = [];

    constructor(public input: string) {}

    public advance(amount: number = 1): Location {
        for (let i = 0; i < amount; i++) {
            const character = this.input[this.index++];
            this.column++;

            if (character === '\n') {
                this.line++;
                this.column = 1;
            }
        }

        return this;
    }

    public advanceLine(): Location {
        while (this.hasInput() && this.input[this.index++] !== '\n') {}
        this.line++;
        this.column = 1;
        return this;
    }

    public peek(): string {
        return this.input[this.index];
    }

    public peekLine(): string {
        const input = this.input.substring(this.index);
        return input.substring(0, input.indexOf("\n"));
    }

    public peekInput(): string {
        return this.input.substring(this.index);
    }

    public hasInput(): boolean {
        return this.input.substring(this.index).trim() !== "";
    }

    public pushSnap() {
        this.snapStack.push([this.index, this.line, this.column]);
    }

    public popSnap() {
        this.snapStack.pop();
    }

    public snap() {
        const [index, line, column] = this.snapStack.pop()!;
        this.index = index;
        this.line = line;
        this.column = column;
    }
}