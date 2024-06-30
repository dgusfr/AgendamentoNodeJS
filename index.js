const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Configuração
app.use(express.static("public"));

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// EJS
app.set("view engine", "ejs");

// Conexão com o banco de dados
mongoose.connect("mongodb://localhost:27017/agendamento", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Model - Usuários
app.get("/", (req, res) => {
  res.send("Olá, Mundo!");
});

app.get("/cadastro", (req, res) => {
  res.render("create");
});

// Servidor
app.listen(8000, () => {});
