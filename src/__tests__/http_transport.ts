
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

let expect = chai.expect;

import {HttpTransportClient, createExpressResolver} from '../';
import {createInterfaceDescriptorFrontendProxy, createInterfaceDescriptorBackendProxy} from '../';

import {TestClass, TestInterfaceDescriptor} from './common';
import {createExpressTestServer} from './utils';

describe("Http transport", function () {
    let testImplementation = new TestClass();
    let frontendProxy: TestInterfaceDescriptor;

    before(async function () {
        let backendProxy = createInterfaceDescriptorBackendProxy(TestInterfaceDescriptor, testImplementation);
        let expressResolver = createExpressResolver(backendProxy);
        
        let testPort = await createExpressTestServer(expressResolver);
        frontendProxy = createInterfaceDescriptorFrontendProxy(
            TestInterfaceDescriptor,
            new HttpTransportClient(`http://localhost:${testPort}/test`)
        );
    });

    describe("should proxy method", function () {
        it("with no arguments", async function () {
            expect(await frontendProxy.getFoo()).to.equal(await testImplementation.getFoo());
        });

        it("with multiple primitive arguments", async function () {
            expect(await frontendProxy.getBar(2, 3)).to.equal(await testImplementation.getBar(2, 3));
        });

        it("returning an object", async function () {
            expect(await frontendProxy.getObject()).to.deep.equal(await testImplementation.getObject());
        });

        it("returning a list of primitives", async function () {
            expect(await frontendProxy.getPrimitiveList()).to.deep.equal(await testImplementation.getPrimitiveList());
        });
        
        it("throwing an exception", function () {
            expect(frontendProxy.getError()).to.eventually.throw(Error, "Backend error.");
        });
    });

})

