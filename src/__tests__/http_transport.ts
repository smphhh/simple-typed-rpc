
import {expect} from 'chai';

import {HttpTransportClient, createExpressResolver} from '../';
import {createInterfaceDescriptorFrontendProxy, createInterfaceDescriptorBackendProxy} from '../';

import {TestClass, TestInterfaceDescriptor} from './common';
import {createExpressTestServer} from './utils';

describe("Http transport", function () {
    let testImplementation = new TestClass();

    let backendProxy = createInterfaceDescriptorBackendProxy(TestInterfaceDescriptor, testImplementation);
    let expressResolver = createExpressResolver(backendProxy);

    let frontendProxy: TestInterfaceDescriptor;

    before(async function () {
        let testServer = await createExpressTestServer('/test', expressResolver);
        frontendProxy = createInterfaceDescriptorFrontendProxy(
            TestInterfaceDescriptor,
            new HttpTransportClient(`http://localhost:${testServer.port}/test`)
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
    });

})

