export interface Logger {
    entries: LogEntry[];
    hasError: boolean;

    log(level: LogLevel, message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
}

export class SimpleLogger implements Logger {
    public entries: LogEntry[] = [];
    public hasError = false;

    public log(level: LogLevel, message: string) {
        const entry = new LogEntry(level, message);
        this.entries.push(entry);
    }

    public info(message: string) {
        this.log(LogLevel.Info, message);
    }

    public warn(message: string) {
        this.log(LogLevel.Warning, message);
    }

    public error(message: string) {
        this.log(LogLevel.Error, message);
        this.hasError = true;
    }
}

export class LogEntry {
    constructor(
        public level: LogLevel,
        public message: string
    ) {}
}

export enum LogLevel {
    Info,
    Warning,
    Error
}