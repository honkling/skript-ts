console.log("Loading " + __filename);

export type Class<T> = {
    new(...any: any[]): T;
}