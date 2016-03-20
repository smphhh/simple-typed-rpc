
import {
    getConstructorMethodNames,
    InterfaceDescriptor,
    RpcMethodResolver
} from './common';

export interface RpcProxy {
    getInterfaceName(): string;
    getInterfaceVersion(): string;
    getMethodNames(): string[];    
}

export interface RpcBackend extends RpcMethodResolver, RpcProxy {
    
}

export class InterfaceDescriptorProxy<InterfaceType> implements RpcProxy {
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

export class InterfaceDescriptorBackend<InterfaceType, BackendType extends InterfaceType>
    extends InterfaceDescriptorProxy<InterfaceType>
    implements RpcBackend {

    constructor(
        constructor: InterfaceDescriptor<InterfaceType>,
        private backend: BackendType
    ) {        
        super(constructor);
    }
    
    async invokeMethod(methodName: string, args: any[]) {
        let returnValue = await this.backend[methodName].apply(this.backend, args);
        
        return returnValue;
    }
    
}
