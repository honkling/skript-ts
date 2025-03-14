import type { Class } from "../lib/types";
import { Type } from "../type/type";

export class Types {
    private types = new Map<string, Type<any>>();
    private idMap = new Map<Function, string>();

    public registerType<T>(clazz: Class<T>, ...ids: string[]): Type<T> {
        const type = new Type(clazz, ids);

        this.idMap.set(clazz, ids[0]);
        for (const id of ids) {
            if (this.types.has(id))
                throw new Error(`There is already a registered type with id '${id}'`);

            this.types.set(id, type);
        }

        return type;
    }

    public getType(id: string | Function): Type<unknown> {
        if (id instanceof Function) {
            const stringId = this.idMap.get(id);

            if (!stringId)
                throw new Error(`Type with class '${id.name}' doesn't exist.`);

            return this.types.get(stringId)!;
        }

        if (!this.types.has(id))
            throw new Error(`Type '${id}' is not registered.`);

        return this.types.get(id)!;
    }

    public findTypeFromValue(value: any): Type<unknown> {
        try {
            return this.getType(value);
        } catch (_) {
            for (const [func, id] of this.idMap.entries()) {
                if (value instanceof func && func !== Object)
                    return this.types.get(id)!;
            }

            throw new Error(`There is no type for class '${value.constructor.name}'`);
        }
    }
}