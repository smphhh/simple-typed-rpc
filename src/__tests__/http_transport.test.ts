
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

let expect = chai.expect;

import {HttpTransportClient, createExpressResolver, RpcBackendError, RpcTransportError} from '../';
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
            return expect(frontendProxy.getError()).to.eventually.be.rejectedWith(RpcBackendError);
        });

        it("with a date argument", async function () {
            let date = new Date();
            expect(await frontendProxy.getByDate(date)).to.equal(await testImplementation.getByDate(date));
        });

        it("returning a date", async function () {
            expect(await frontendProxy.getDate()).to.deep.equal(await testImplementation.getDate());
        });

        it("with null as argument", async function () {
            expect(await frontendProxy.getWithOptionalArg(null)).to.deep.equal(await testImplementation.getWithOptionalArg(null));
        });

        it("returning null", async function () {
            expect(await frontendProxy.getNull()).to.be.null;
        });

        it("returning undefined", async function () {
            expect(await frontendProxy.getUndefined()).to.be.undefined;
        });
    });
    
    it("should not pass non-plain objects in strict mode", function () {
        let complexObject = Object.create({ a: 1 });
        return expect(frontendProxy.getWithAnyArgReturningVoid(complexObject)).to.eventually.be.rejectedWith(RpcTransportError);
    });

    it("should not return non-plain objects in strict mode", function () {
        return expect(frontendProxy.getNonPlainObject()).to.eventually.be.rejectedWith(RpcBackendError);
    });

    it("should proxy methods with optional arguments", async function () {
        expect(await frontendProxy.getWithOptionalArg()).to.equal(await testImplementation.getWithOptionalArg());
    });

})

