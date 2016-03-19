

import {Facade} from '../common';


export class DirectTransport<T> {
    private client: T;
    
    constructor(
        FacadeType: Facade<T>,
        private server: T
    ) {
        let facadeInstance = new FacadeType();        
        let facadePrototype = Object.getPrototypeOf(facadeInstance);
        
        let proxiedMethodNames = Object.getOwnPropertyNames(facadePrototype).filter(propName => {
            return propName !== 'constructor' && typeof facadeInstance[propName] === 'function';
        });
            
        let proxyObject: any = {};
        
        for (let methodName of proxiedMethodNames) {
            proxyObject[methodName] = function () {
                let args = [];
                for (let arg of arguments) {
                    args.push(arg);
                }
                
                return server[methodName].apply(server, args);
            }
        }
        
        this.client = proxyObject;
    }
    
    getClient(): T {
        return this.client;
    }
}
