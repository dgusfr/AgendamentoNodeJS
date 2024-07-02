// Importa os módulos necessários: express para criar o servidor, body-parser para manipulação de dados de requisição,
// mongoose para manipulação do banco de dados, e o serviço de agendamentos
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const appointmentService = require("./services/AppointmentService");
const AppointmentService = require("./services/AppointmentService");

// Configura o servidor para servir arquivos estáticos da pasta "public"
app.use(express.static("public"));

// Configura o body-parser para analisar dados URL-encoded e JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configura o mecanismo de visualização para usar EJS
app.set("view engine", "ejs");

// Conecta ao banco de dados MongoDB
mongoose.connect("mongodb://localhost:27017/agendamento", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useFindAndModify", false);

// Rota para renderizar a página inicial
app.get("/", (req, res) => {
  res.render("index");
});

// Rota para renderizar a página de cadastro
app.get("/cadastro", (req, res) => {
  res.render("create");
});

// Rota para criar um novo agendamento
app.post("/create", async (req, res) => {
  var status = await appointmentService.Create(
    req.body.name,
    req.body.email,
    req.body.description,
    req.body.cpf,
    req.body.date,
    req.body.time
  );

  if (status) {
    res.redirect("/");
  } else {
    res.send("Ocorreu uma falha!");
  }
});

// Rota para obter todos os agendamentos não finalizados em formato JSON
app.get("/getcalendar", async (req, res) => {
  var appointments = await AppointmentService.GetAll(false);
  res.json(appointments);
});

// Rota para obter um agendamento específico pelo ID e renderizar a página de evento
app.get("/event/:id", async (req, res) => {
  var appointment = await AppointmentService.GetById(req.params.id);
  console.log(appointment);
  res.render("event", { appo: appointment });
});

// Rota para marcar um agendamento como finalizado
app.post("/finish", async (req, res) => {
  var id = req.body.id;
  var result = await AppointmentService.Finish(id);
  res.redirect("/");
});

// Rota para listar todos os agendamentos
app.get("/list", async (req, res) => {
  var appos = await AppointmentService.GetAll(true);
  res.render("list", { appos });
});

// Rota para buscar agendamentos por email ou CPF e renderizar a lista de resultados
app.get("/searchresult", async (req, res) => {
  var appos = await AppointmentService.Search(req.query.search);
  res.render("list", { appos });
});

// Define o tempo de intervalo para enviar notificações (5 minutos)
var pollTime = 1000 * 60 * 5;

// Configura um intervalo para enviar notificações periodicamente
setInterval(async () => {
  await AppointmentService.SendNotification();
}, pollTime);

// Inicia o servidor na porta 3000
app.listen(3000, () => {
  console.log("Servidor rodando!");
});
