import * as net from 'net';

interface RpcRequest {
    jsonrpc: string;
    method: string;
    params: any[];
    id: number;
}

interface RpcResponse {
    jsonrpc: string;
    result: any;
    id: string;
}

export class DevkitRpcClient {
    private static instance: DevkitRpcClient;
    private host: string;
    private port: number;
    private client: net.Socket;
    private buffer: string;
    private requestCount: number;
    private responseHandlers: { [key: string]: (result: any) => void };

    constructor(host: string, port: number) {
        this.host = host;
        this.port = port;
        this.client = new net.Socket();
        this.buffer = '';
        this.requestCount = 1;
        this.responseHandlers = {};
        this.connect();
    }

    public static getInstance(host: string = 'localhost', port: number = 19190): DevkitRpcClient {
        if (!DevkitRpcClient.instance) {
            DevkitRpcClient.instance = new DevkitRpcClient(host, port);
        }
        return DevkitRpcClient.instance;
    }

    private connect() {
        this.client.connect(this.port, this.host, () => {
            console.log('Connected to server');
        });

        this.client.on('data', (data) => {
            let chunk = data.toString();
            if(chunk.at(chunk.length - 1) != '\n') {
                this.buffer += chunk;
            } 
            else {
                this.buffer += chunk;
                let response: RpcResponse = JSON.parse(this.buffer);
                if(this.responseHandlers[response.id]) {
                    this.responseHandlers[response.id](response.result);
                    delete this.responseHandlers[response.id];
                }
                this.buffer = '';
            }
        });

        this.client.on('close', () => {
            console.log('Connection closed');
        });
    }

    public sendRequest(method: string, params: any[]): Promise<any> {
        return new Promise((resolve, reject) => {
            const intervalId = setInterval(() => {
                if(Object.keys(this.responseHandlers).length === 0) {
                    clearInterval(intervalId);
                    
                    const id = this.requestCount++;
                    const request: RpcRequest = {
                        jsonrpc: '2.0',
                        method: method,
                        params: params,
                        id: id
                    };
                    this.responseHandlers[id] = resolve;
                    const content = JSON.stringify(request) + "\n";
                    console.log('Sending request: ' + content);
                    this.client.write(content);
                }
            }, 1); 
        });
    }
}

type DevkitClientProxy = {
    [key: string]: any;
};

export function createProxy(client: DevkitRpcClient, path: string[] = []): DevkitClientProxy {
    return new Proxy(() => {}, {
        get(target, prop) {
            const newPath = path.concat(prop as string);
            return createProxy(client, newPath);
        },
        apply(target, thisArg, argumentsList) {
            const methodName = path.join('.');
            return client.sendRequest(methodName, argumentsList);
        }
    });
}

const client = {
    conn: {} as DevkitClientProxy
};

export function initialize(host: string, port: number) {
    const rpcClient = DevkitRpcClient.getInstance(host, port);
    client.conn = createProxy(rpcClient);
}

export default client;
