import type { LogEntry, Logger, LogLevel } from "../lib/logger";
import type { Location } from "./location";
import type { SkriptParser } from "./parser";

export class LocationProxyLogger implements Logger {
    public entries: LogEntry[];
    public hasError = false;

    constructor(
        public endpoint: Logger,
        public location: Location
    ) {
        this.entries = endpoint.entries;
    }

    public log(level: LogLevel, message: string): void {
        this.endpoint.log(level, message);
        this.hasError = this.endpoint.hasError;
    }

    public info(message: string) {
        this.endpoint.info(this.attachLocation(message));
        this.hasError = this.endpoint.hasError;
    }

    public warn(message: string) {
        this.endpoint.warn(this.attachLocation(message));
        this.hasError = this.endpoint.hasError;
    }

    public error(message: string) {
        this.endpoint.error(this.attachLocation(message));
        this.hasError = this.endpoint.hasError;
    }

    private attachLocation(message: string): string {
        const { line, column } = this.location;
        return `${message} (occurred at ${line}:${column})`;
    }
}