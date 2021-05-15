After cloning this repository use 
     
     **npm install**

Create a table( attributes are id and name ) in psql and add your username, database name to the consumer.js and producer.js page.

          **CREATE TABLE name (
          user_id BIGSERIAL PRIMARY KEY,
          name VARCHAR(50) NOT NULL
          );**

Start your docker locally on PC.

Run the docker command in the vscode terminal

    **docker-compose up** 


Open a command prompt and go to your Kafka folder and run consumer 
     
     **.\bin\windows\kafka-console-consumer.bat \ --bootstrap-server localhost:9092,localhost:9093 --topic test-topic \ --from-beginning**

Open 2 new terminals in vscode and run producer.js and consumer.js

        **node producer.js**
        **node consumer.js**

