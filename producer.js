const port = 3007
const express = require('express')
const bodyParser = require('body-parser')
const Router = require('express-promise-router');
const app = express()
const { Kafka } = require('kafkajs')


const router = new Router();
app.use('/', router);
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// -------------------------Data base Connection-------------//

const Pool = require('pg').Pool
const pool = new Pool({
  user: '******',
  host: 'localhost',
  database: '******',
  password: '*******',
  port: 5432,
})

// ----------------------Kafka client-id, brokers setup--------------------------

const kafka = new Kafka({
  clientId: 'my-producer',
  brokers: ['localhost:9092', 'localhost:9093']
})
const producer = kafka.producer();
console.log("Connecting......")
producer.connect()
console.log("Connect !!")

// ----------Post data into DB----------------------------//

router.post('/name', (req, res) => {
  const { name } = req.body;
  try {
    pool.query('INSERT INTO name (name) VALUES ($1)', [name], (error, results) => {
      if (error) {
        throw error
      }
      res.status(201).send(`Name: ${name}`)
    })
  } catch (err) {
    console.error(`something bad happend ${err}`)
  }

  // ------Written for parse the name variable in kafka cluster---------//

  const parsedName = String(name);

  // ----------------Producer send data to kafka cluster---------------------------//
  producer.send({
    topic: 'test-topic',
    messages: [
      {
        value: parsedName
      }
    ]
  })
  console.log(`Send Successfully! `);
})

// -----Retrive from DB---------//

router.get('/name', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM name');
  res.status(200).json(rows);
});

// --------------------Disconnect Kafka Cluster-------------------------//

producer.disconnect();

// --------------------------default port number----------------------//

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
