"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
const EventEmitter = require('events');
const amqp = require('amqplib');
class Queue extends EventEmitter {
    constructor(url, configuration, ack) {
        super();
        this.url = url;
        this.configuration = configuration;
        this.ack = ack;
    }
    async createConnection() {
        try {
            if (!this.connection) {
                this.connection = await amqp.connect(this.url);
            }
            return this.connection;
        }
        catch (e) {
            throw new Error(`create connection failed error: ${e.message}`);
        }
    }
    async createChannel() {
        try {
            if (!this.channel) {
                const connection = await this.createConnection();
                this.channel = await connection.createChannel();
            }
            return this.channel;
        }
        catch (e) {
            throw new Error(`create channel failed error: ${e.message}`);
        }
    }
    async send(queue, data) {
        try {
            const channel = await this.createChannel();
            const message = JSON.stringify(data);
            await channel.assertQueue(queue, this.configuration);
            return await channel.sendToQueue(queue, Buffer.from(message));
        }
        catch (e) {
            throw new Error(`send message to ${queue} failed error: ${e.message}`);
        }
    }
    async consumer(queue, eventName) {
        try {
            const channel = await this.createChannel();
            channel.assertQueue(queue);
            await channel.consume(queue, (msg) => {
                const JsonMsg = JSON.parse(msg.content.toString());
                this.emit(eventName, JsonMsg);
            }, {
                noAck: this.ack
            });
        }
        catch (e) {
            throw new Error(`consume ${queue} failed error: ${e.message}`);
        }
    }
}
exports.Queue = Queue;
