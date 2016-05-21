# Simple typed RPC
Experimental typesafe RPC library for TypeScript

## Usage

Setting up an RPC channel requires
* A transport passing raw JSON-serialized payloads between the frontend and the backend. Usually consists of a transport client on the frontend side and a transport server on the backend side.
* A frontend proxy translating method calls into payloads to be passed through the transport, and parsing response payloads into method return values.
* A backend proxy parsing method call payloads arriving through the transport into method calls onto the actual backend implementation, and translating return values into payloads to be passed back through the transport.

For now, see tests for details.

