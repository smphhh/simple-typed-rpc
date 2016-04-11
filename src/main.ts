
let bodyParser = require('body-parser');
let express = require('express');

import {
    definePromiseMethod,
    ExpressServer,
    HttpClient,
    InterfaceDescriptorBackend,
    InterfaceDescriptorFrontend
} from './';

class TestInterface {    
    static interfaceVersion = "2.0";
    
    getFoo() { return definePromiseMethod<string>(); }
    getBar(n: number) { return definePromiseMethod<string>(); }
    getError() { return definePromiseMethod<number>(); }
    getVoid() { return definePromiseMethod<void>(); }
}

class TestClass {
    private foo: any;

    constructor(n?: number) {
        this.foo = { a: n || 1 };
    }

    async getFoo() {
        return "foo";
    }

    async getBar(n: number) {
        return 2 * n + " hey!";
    }
    
    async getError() {
        if (1) {
            throw new Error("It's an error.");
        }
        
        return 1;
    }
    
    async getVoid() {
        
    }
    
    async getAdditional() {
        return 0;
    }
}

let rpcBackend = new InterfaceDescriptorBackend(TestInterface, new TestClass());

let server = new ExpressServer(rpcBackend);

console.log(rpcBackend.getInterfaceName(), rpcBackend.getInterfaceVersion(), rpcBackend.getMethodNames());

let app = express();
app.use(bodyParser.json());

app.post('/test_class', server.getResolver());

let s = app.listen(0, async () => {
    let port = s.address().port;
    
    let serverEndpoint = `http://localhost:${port}/test_class`;
    
    //let client = httpClient.createFromTemplateClass<InterfaceDescriptor>(serverEndpoint, backend);
    
    let client = new HttpClient(serverEndpoint);
    
    let frontend = new InterfaceDescriptorFrontend(TestInterface, client);
    
    let proxy = frontend.getInterface();
    

    //let client2 = await httpClient.createFromServerMetadata<TestClass>(serverEndpoint);

    console.log(await proxy.getBar(2));
    console.log(await proxy.getFoo());
    console.log(await proxy.getError());
    
    //console.log(await client2.getBar(5));

    console.log("Done");
    
});
