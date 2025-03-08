export class Result<T> {
    private constructor(
        public value: T | null,
        public error: Error | null
    ) {}

    public static success<T>(value: T): Result<T> {
        return new Result(value, null);
    }

    public static failure<T>(error: Error): Result<T> {
        return new Result<T>(null, error);
    }

    public isSuccess(): boolean {
        return this.value !== null && this.error === null;
    }

    public isFailure(): boolean {
        return this.value === null && this.error !== null;
    }

    public getValue(): T {
        if (this.value === null)
            throw new Error("Result doesn't have a value");

        return this.value;
    }

    public getError(): Error {
        if (this.error === null)
            throw new Error("Error doesn't have a value");

        return this.error;
    }
}