const port = 3006
const { Kafka } = require('kafkajs')
const express = require('express')
const bodyParser = require('body-parser')
const Router = require('express-promise-router');
const app = express()

const router = new Router();
app.use('/', router);
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


// -------------------------DB Connected--------------------

const Pool = require('pg').Pool
const pool = new Pool({
  user: '******',
  host: 'localhost',
  database: '******',
  password: '******',
  port: 5432,
})

// ----------------------Connect to kafka broker, client-id and then retrive data from cluster--------------------------//

run();
async function run() {

  try {
    const kafka = new Kafka({
      clientId: 'my-producer',
      brokers: ['localhost:9092', 'localhost:9093']
    })

    const consumer = kafka.consumer({ "groupId": "test" })
    console.log("Connecting.....")
    await consumer.connect()
    console.log("Connect !!")
    consumer.subscribe({
      "topic": "test-topic",
      "fromBeginning": true
    })
    await consumer.run({
      "eachMessage": ({ topic, message }) => {
        let msg = `${message.value.toString()}`
        console.log({ value: msg })

        // ------------------------Store data in Consumer's DB------------------------------------//

        const insertResponce = pool.query({
          text: 'INSERT INTO consumer (name) VALUES ($1)',
          values: [msg],
        });
        console.log("message inserted");
      },
    })
  }
  catch (err) {
    console.error(`something bad happend ${err}`)
  }
  finally { }

}

// ----------------------------Default Port Number----------------------------------------//

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})