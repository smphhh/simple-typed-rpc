
import {JsonTransportClient, JsonTransportBackend} from '../transport';
import {RpcTransportError} from '../transport/common';

type MetadataQueryName = 'methodNames';

interface BasePayload {
    interfaceMetadata?: {
        name: string;
        version: string;
    }
}

interface MetadataQuery extends BasePayload {
    metadataQuery: MetadataQueryName
}

interface MethodCall extends BasePayload {
    methodName: string,
    args: any[]    
}

type RequestPayload = MetadataQuery | MethodCall;

export interface ResponsePayload {
    error?: any,
    returnValue?: any
}

function isMetadataQuery(arg: RequestPayload): arg is MetadataQuery {
    return (arg as MetadataQuery).metadataQuery !== undefined;
}

function isMethodCall(arg: RequestPayload): arg is MethodCall {
    return (arg as MethodCall).methodName !== undefined;
}

export class RpcBackendError extends Error {
    constructor(message?: string) {
        message = message || RpcBackendError.name;
        super(message);
    }
}

export interface RpcMetadataInterface {
    getInterfaceName(): string;
    getInterfaceVersion(): string;
    getMethodNames(): string[];    
}

/**
 * Generic frontend proxy translating method calls into JSON transport payloads.
 */
export class GenericJsonFrontendProxy {
    private proxyObject;
    
    constructor(
        private metadataInterface: RpcMetadataInterface,
        private transportClient: JsonTransportClient
    ) {
        let methodNames = metadataInterface.getMethodNames();
        this.proxyObject = {};
        
        let that = this;
        for (let methodName of methodNames) {
            // Can't use arrow function here because they don't have the arguments object.
            this.proxyObject[methodName] = function () {
                let args = [];
                for (let arg of arguments) {
                    args.push(arg);
                }
                                
                return that.invokeMethod(methodName, args);
            }
        }
    }
    
    getProxyObject() {
        return this.proxyObject;
    }
    
    private async invokeMethod(methodName: string, args: any[]) {
        let requestPayload = {
            interfaceMetadata: {
                name: this.metadataInterface.getInterfaceName(),
                version: this.metadataInterface.getInterfaceVersion()
            },
            methodName: methodName, 
            args: args
        };

        let responsePayload;

        try {
            responsePayload = await this.transportClient.sendJsonPayload(requestPayload);
        } catch (error) {
            throw new RpcTransportError(error.message);
        }

        // TODO: perform metadata validation here.

        if (responsePayload.error) {
            throw new RpcBackendError(responsePayload.error);
        } else {
            return responsePayload.returnValue;
        }
    }
}

/**
 * Generic backend proxy translating JSON transport payloads into actual backend method calls.
 */
export class GenericJsonBackendProxy implements JsonTransportBackend {
    constructor(
        private metadataInterface: RpcMetadataInterface,
        private backendImplementation: any
    ) {    
    }
    
    async handleJsonPayload(payload: any): Promise<ResponsePayload> {

        try {
            let requestPayload = GenericJsonBackendProxy.validatePayload(payload);

            let interfaceMetadata = requestPayload.interfaceMetadata;

            if (interfaceMetadata) {
                this.checkInterfaceName(interfaceMetadata.name);
                this.checkInterfaceVersion(interfaceMetadata.version);
            }

            let responsePayload = await this.resolver(requestPayload);

            return responsePayload;

        } catch (error) {
            console.log(error);

            if (error instanceof RpcBackendError) {
                return { error: error.message || "RPC backend error" };
            } else if (error instanceof RpcTransportError) {
                return { error: error.message || "RPC transport error" };
            } else {
                return { error: error.message || "Unknown error" };
            }
        }
    }

    private static validatePayload(requestPayload: any) {
        if (!requestPayload || typeof requestPayload !== 'object') {
            throw new RpcTransportError("Invalid request payload.");
        }

        if (typeof requestPayload.methodName === 'string' && Array.isArray(requestPayload.args)) {
            return requestPayload as RequestPayload;
        } else if (typeof requestPayload.metadataQuery === 'string') {
            return requestPayload as RequestPayload;
        } else {
            throw new RpcTransportError("Invalid request payload.");
        }
    }

    private async processPayload(requestPayload: RequestPayload) {

    }
    
    private async resolver(requestPayload: RequestPayload): Promise<ResponsePayload> {
        if (isMethodCall(requestPayload)) {
            let returnValue = await this.invokeMethod(
                requestPayload.methodName,
                requestPayload.args
            );

            return {
                returnValue: returnValue
            };

        } else if (isMetadataQuery(requestPayload)) {
            throw new RpcBackendError("Not implemented.");

        } else {
            throw new RpcBackendError("Not implemented.");
        }

    }
    
    private invokeMethod(methodName: string, args: any[]) {
        try { 
            return this.backendImplementation[methodName].apply(this.backendImplementation, args);
        } catch (error) {
            throw new RpcBackendError(error.message);
        }
    }

    private checkInterfaceName(interfaceName: string) {
        if(interfaceName !== this.metadataInterface.getInterfaceName()) {
            throw new RpcTransportError(`Interface name mismatch. Backend expected "${this.metadataInterface.getInterfaceName()}" and frontend provided "${interfaceName}".'`);
        }
    }

    private checkInterfaceVersion(interfaceVersion: string) {
        if(interfaceVersion !== this.metadataInterface.getInterfaceVersion()) {
            throw new RpcTransportError(`Interface version mismatch. Backend expected "${this.metadataInterface.getInterfaceVersion()}" and frontend provided "${interfaceVersion}".'`)
        }
    }
}
