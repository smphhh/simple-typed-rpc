

export interface Request {
    body: any    
}

export interface Response {
    status: (code: number) => Response,
    json: (payload: any) => void
}
