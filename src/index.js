const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.listen(3333);
app.use(express.json());

const costumers = [];

app.post("/account"),
  (req, res) => {
    const { cpf, name } = req.body;

    const id = uuidv4();

    costumers.push({ name, cpf, id, statement: [] });

    return response.status(201).send();
  };
