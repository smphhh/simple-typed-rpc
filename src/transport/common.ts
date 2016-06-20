export class RpcTransportError extends Error {
    constructor(message?: string) {
        message = message || RpcTransportError.name;
        super(message);
    }
}
