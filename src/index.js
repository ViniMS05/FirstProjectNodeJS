const { request } = require("express");
const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());

const customers = [];

//Middleware
function verifyIfCostumersAlreadyExists(req, res, next) {
  const { cpf, name } = req.body;

  const costumersAlreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  );

  if (costumersAlreadyExists) {
    return res.status(400).json({ error: "Costumer already exists!" });
  }

  req.cpf = cpf;
  req.name = name;

  return next();
}

function verifyIfExistsAccountCPF(req, res, next) {
  const { cpf } = req.headers;

  const customer = customers.find((customer) => customer.cpf === cpf);

  if (!customer) {
    return res.status(400).json({ error: "Customer not found" });
  }

  req.customer = customer;

  return next();
}

app.post("/account", verifyIfCostumersAlreadyExists, (req, res) => {
  const { cpf, name } = req;

  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: [],
  });

  return res.status(201).send();
});

//app.use(verifyIfExistsAccountCPF)

app.get("/statement", verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;

  return res.send(customer.statement);
});

app.post("/deposit", verifyIfExistsAccountCPF, (req, res) => {
  const { description, amount } = req.body;

  const { customer } = req;

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit",
  };

  customer.statement.push(statementOperation);

  return res.status(201).send();
});

app.listen(3333);
