

export interface Response {
    json: () => any
}

export interface Fetch {
    (url: string, options?: any): Promise<Response>
}


let fetch: Fetch = require('node-fetch');

export default fetch;


