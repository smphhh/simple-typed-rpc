

export interface Response {
    json: () => any;
    text: () => string;
}

export interface Fetch {
    (url: string, options?: any): Promise<Response>
}


let fetch: Fetch = require('node-fetch');

export default fetch;


