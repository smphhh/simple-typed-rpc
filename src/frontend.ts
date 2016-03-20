
import {InterfaceDescriptorProxy} from './backend';
import {createProxyFromMethodNames, InterfaceDescriptor, RpcMethodResolver} from './common';

export class InterfaceDescriptorFrontend<InterfaceType> {
    private interfaceDescriptorProxy: InterfaceDescriptorProxy<InterfaceType>;

    constructor(
        constructor: InterfaceDescriptor<InterfaceType>,
        private methodResolver: RpcMethodResolver
    ) {        
        this.interfaceDescriptorProxy = new InterfaceDescriptorProxy(constructor);
    }
    
    getInterface() {
        return createProxyFromMethodNames<InterfaceType>(
            this.interfaceDescriptorProxy.getMethodNames(),
            (methodName: string, args: any[]) => this.methodResolver.invokeMethod(methodName, args)
        );
    }
    
}

