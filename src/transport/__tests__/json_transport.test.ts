
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

let expect = chai.expect;

import {
    jsonParse,
    jsonStringify,
    serializationHeaderTag,
    serializationVersionTag
} from '../json_transport';

describe("JSON transport", function () {
    
    it("should serialize and deserialize dates", function () {
        var obj = {
            a: 1,
            d: new Date()
        };

        let serializedObj = jsonStringify(obj);

        let deserializedObj = jsonParse(serializedObj);

        expect(deserializedObj).to.deep.equal(obj);
    });

    it("should serialize and deserialize arrays", function () {
        var obj = {
            a: 1,
            d: [1, 2, 3]
        };

        let serializedObj = jsonStringify(obj);

        let deserializedObj = jsonParse(serializedObj);

        expect(deserializedObj).to.deep.equal(obj);
    });

});