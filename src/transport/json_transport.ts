
import {RpcTransportError} from './common';

export interface JsonTransportClient {
    sendJsonPayload(jsonPayload: any): Promise<any>;
    //invokeMethod(methodName: string, args: any[]): Promise<any>;
}

export interface JsonTransportBackend {
    handleJsonPayload(payload: any): Promise<any>;
}

export let serializationHeaderSeparator = "___";
export let serializationHeaderTag = "simple-typed-rpc";
export let serializationVersionTag = "j9DnJ2Yiu08";
export let serializationDateTypeTag = "Date";

export function replacer(key: any, value: any): any {
    if (value === undefined || value === null) {
        return value;
    } else if (typeof value === "string") {
        return value;
    } else if (typeof value === "number") {
        return value;
    } else if (typeof value === "boolean") {
        return value;
    } else if (typeof value === "object") {
        let objectPrototype = Object.getPrototypeOf(value);
        if (objectPrototype === Object.prototype) {
            let obj: any = {};
            for (let prop of Object.keys(value)) {
                obj[prop] = serializeValue(value[prop]);
            }
            return obj;

        } else if (objectPrototype === Array.prototype) {
            return value.map(v => serializeValue(v));
        } else {
            throw new RpcTransportError("Cannot serialize non-plain objects");
        }
    } else {
        throw new RpcTransportError(`Cannot serialize values of type: ${value}`);
    }
}

function serializeValue(value: any) {
    if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Date.prototype) {
        return serializeDate(value);
    } else {
        return value;
    }
}

function serializeDate(date: Date) {
    return [
        serializationHeaderTag,
        serializationVersionTag,
        serializationDateTypeTag,
        date.toJSON()
    ].join(serializationHeaderSeparator);
}

function parseTaggedValue(value: string) {

}

export function jsonStringify(data: any, strict = true) {
    return JSON.stringify(data, replacer);
}

export function reviver(key: any, value: any) {
    if (typeof value === "string") {
        let parts = value.split(serializationHeaderSeparator);
        if (parts[0] === serializationHeaderTag && parts[1] === serializationVersionTag) {
            if (parts[2] === serializationDateTypeTag) {
                return new Date(parts[3]);
            } else {
                throw new RpcTransportError(`Invalid serialization type tag: ${parts[2]}`);
            }
        } else {
            return value;
        }
    } else {
        return value;
    }
}

export function jsonParse(data: string, strict = true) {
    return JSON.parse(data, reviver);
}
