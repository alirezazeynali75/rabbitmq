const EventEmitter = require('events')
const amqp = require('amqplib')
export class Queue extends EventEmitter {
  protected readonly url: string;
  protected connection: any;
  protected channel: any;
  protected configuration: AmqpConfiguration;
  protected ack: boolean;

  constructor (url: string, configuration: AmqpConfiguration, ack: boolean) {
    super()
    this.url = url
    this.configuration = configuration
    this.ack = ack
  }

  private async createConnection () {
    try {
      if (!this.connection) {
        this.connection = await amqp.connect(this.url)
      }
      return this.connection
    } catch (e) {
      throw new Error(`create connection failed error: ${e.message}`)
    }
  }

  private async createChannel () {
    try {
      if (!this.channel) {
        const connection = await this.createConnection()
        this.channel = await connection.createChannel()
      }
      return this.channel
    } catch (e) {
      throw new Error(`create channel failed error: ${e.message}`)
    }
  }

  public async send (queue: string, data: string) {
    try {
      const channel = await this.createChannel()
      const message = JSON.stringify(data)
      await channel.assertQueue(queue, this.configuration)
      return await channel.sendToQueue(queue, Buffer.from(message))
    } catch (e) {
      throw new Error(`send message to ${queue} failed error: ${e.message}`)
    }
  }

  public async consumer<T = any> (queue: string, eventName?: string) {
    try {
      const channel = await this.createChannel()
      channel.assertQueue(queue)
      await channel.consume(
        queue,
        (msg: any) => {
          const JsonMsg: T = JSON.parse(msg.content.toString())
          this.emit(eventName, <T>JsonMsg)
        },
        {
          noAck: this.ack
        }
      )
    } catch (e) {
      throw new Error(`consume ${queue} failed error: ${e.message}`)
    }
  }
}
