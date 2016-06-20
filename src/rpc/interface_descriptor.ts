
import {JsonTransportClient} from '../transport';
import {getConstructorMethodNames} from '../utils';

import {RpcMetadataInterface, GenericJsonFrontendProxy, GenericJsonBackendProxy} from './common';

export interface InterfaceDescriptor<T> {
    new(): T,
    interfaceVersion: string;
}

/**
 * RPC metadata interface implementation based on the data in the interface descriptor. 
 */
class InterfaceDescriptorMetadataInterface<InterfaceType> implements RpcMetadataInterface {
    private methodNames: string[];
    private interfaceName: string;
    private interfaceVersion: string;
    
    constructor(
        constructor: InterfaceDescriptor<InterfaceType>
    ) {
        this.interfaceName = constructor.name;
        this.interfaceVersion = constructor.interfaceVersion;
        
        this.methodNames = getConstructorMethodNames(constructor);        
    }
    
    getInterfaceName() {
        return this.interfaceName;
    }
    
    getInterfaceVersion() {
        return this.interfaceVersion;
    }
    
    getMethodNames() {
        return this.methodNames;
    }
}

/**
 * Create a frontend for the proxied interface from an interface descriptor and a JSON transport client.
 */
export function createInterfaceDescriptorFrontendProxy<T>(
    interfaceDescriptor: InterfaceDescriptor<T>,
    transportClient: JsonTransportClient
) {
    let metadataInterface = new InterfaceDescriptorMetadataInterface(interfaceDescriptor);
    let frontendProxy = new GenericJsonFrontendProxy(metadataInterface, transportClient);
    return frontendProxy.getProxyObject() as T;
}

/**
 * Wrap an implementation of the proxied interface inside a JSON transport backend proxy.
 */
export function createInterfaceDescriptorBackendProxy<T>(
    interfaceDescriptor: InterfaceDescriptor<T>,
    backendImplementation: T
) {
    let metadataInterface = new InterfaceDescriptorMetadataInterface(interfaceDescriptor);
    let backendProxy = new GenericJsonBackendProxy(metadataInterface, backendImplementation);
    return backendProxy;
}
