declare const EventEmitter: any;
export declare class Queue extends EventEmitter {
    protected readonly url: string;
    protected connection: any;
    protected channel: any;
    protected configuration: AmqpConfiguration;
    protected ack: boolean;
    constructor(url: string, configuration: AmqpConfiguration, ack: boolean);
    private createConnection;
    private createChannel;
    send(queue: string, data: string): Promise<any>;
    consumer<T = any>(queue: string, eventName?: string): Promise<void>;
}
export {};
