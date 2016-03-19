
let bodyParser = require('body-parser');
let express = require('express');

import {ExpressServer, httpClient} from './transport';

class TestClass {
    private foo: any;

    constructor(n?: number) {
        this.foo = { a: n || 1 };
    }

    async getFoo() {
        return this.foo.a;
    }

    async getBar(n: number) {
        return 2 * n + " hey!";
    }

}

let backend = new TestClass();
let server = new ExpressServer(backend);
let resolver = server.getResolver();

let app = express();
app.use(bodyParser.json());

app.post('/test_class', server.getResolver());

let s = app.listen(0, async () => {
    let port = s.address().port;
    
    let serverEndpoint = `http://localhost:${port}/test_class`;
    
    let client = httpClient.createFromTemplateClass(serverEndpoint, backend);

    let client2 = await httpClient.createFromServerMetadata<TestClass>(serverEndpoint);

    console.log(await client.getBar(2));
    console.log(await client.getFoo());
    
    console.log(await client2.getBar(5));

    console.log("Done");
    
});
