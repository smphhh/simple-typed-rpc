
import {JsonTransportClient} from '../transport';
import {getConstructorMethodNames} from '../utils';

import {RpcMetadataInterface, GenericClientProxy, GenericBackendProxy} from './common';

export interface InterfaceDescriptor<T> {
    new(): T,
    interfaceVersion: string;
}

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

export function createInterfaceDescriptorClientProxy<T>(
    interfaceDescriptor: InterfaceDescriptor<T>,
    transportClient: JsonTransportClient
) {
    let metadataInterface = new InterfaceDescriptorMetadataInterface(interfaceDescriptor);
    let genericClientProxy = new GenericClientProxy(metadataInterface, transportClient);
    return genericClientProxy.getProxyObject() as T;
}

export function createInterfaceDescriptorBackend<T>(
    interfaceDescriptor: InterfaceDescriptor<T>,
    backendImplementation: T
) {
    let metadataInterface = new InterfaceDescriptorMetadataInterface(interfaceDescriptor);
    let genericBackendProxy = new GenericBackendProxy(metadataInterface, backendImplementation);
    return genericBackendProxy;
}
