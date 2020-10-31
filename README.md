# rabbitmq

RabbitMq agent

In javascript
```javascript
    const {Queue} = require('@alirezazeynali/rabbitmq')
    const queue = new Queue('url', {durable: true}, true)
    queue.send('queue_name', data)
    queue.consumer('queue_name', 'event')
    queue.on ('event', (msg) => {
        // do with msg
    })
```

In typescript
```typescript
    import {Queue} from '@alirezazeynali/rabbitmq'
```
