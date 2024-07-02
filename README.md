# Sistema de Agendamento

Este projeto é um sistema de agendamento utilizando Node.js, Express e FullCalendar. Permite criar, visualizar e gerenciar compromissos.

<div align="center">
  <img src="img/logo.png" alt="Imagem do Projeto" width="100">
</div>

## Sumário

- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Status](#status)
- [Descrição](#descrição)
- [Funcionalidades](#funcionalidades)
- [Explicação](#explicação)
- [Como Usar](#como-usar)
- [Autor](#autor)

## Tecnologias Utilizadas

<div style="display: flex; flex-direction: row;">
  <div style="margin-right: 20px; display: flex; justify-content: flex-start;">
    <img src="img/js.png" alt="Logo Linguagem" width="100"/>
  </div>
  <div style="margin-right: 20px; display: flex; justify-content: flex-start;">
    <img src="img/node.png" alt="Logo Linguagem" width="100"/>
  </div>
</div>

## Status

![Concluído](http://img.shields.io/static/v1?label=STATUS&message=CONCLUIDO&color=GREEN&style=for-the-badge)

## Descrição

Este projeto é um sistema de agendamento desenvolvido com Node.js e Express, integrado com o FullCalendar para visualização dos compromissos. Permite o cadastro, listagem, busca, e notificação de compromissos.

## Funcionalidades

- Cadastro de novos compromissos.
- Visualização de compromissos no calendário.
- Listagem e busca de compromissos.
- Envio de notificações para compromissos próximos.

## Explicação

### 1. Configuração Inicial

```javascript
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const appointmentService = require("./services/AppointmentService");
const AppointmentService = require("./services/AppointmentService");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
```

Nesta seção, configuramos o Express, definimos o uso do BodyParser para parsing de requisições e configuramos a engine de visualização EJS. Também importamos o serviço de agendamentos.

### 2. Conexão com o Banco de Dados

```javascript
mongoose.connect("mongodb://localhost:27017/agendamento", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useFindAndModify", false);
```

Aqui, estabelecemos a conexão com o banco de dados MongoDB.

### 3. Rotas

Rota Principal

```javascript
app.get("/", (req, res) => {
  res.render("index");
});
```

Renderiza a página principal.

Rota de Cadastro

```javascript
app.get("/cadastro", (req, res) => {
  res.render("create");
});
```

Renderiza a página de cadastro.

Criação de Compromisso

```javascript
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
```

Processa a criação de um novo compromisso e redireciona para a página principal se bem-sucedido.

Obtenção de Compromissos

```javascript
app.get("/getcalendar", async (req, res) => {
  var appointments = await AppointmentService.GetAll(false);
  res.json(appointments);
});
```

Retorna todos os compromissos em formato JSON.

Visualização de Compromisso

```javascript
app.get("/event/:id", async (req, res) => {
  var appointment = await AppointmentService.GetById(req.params.id);
  console.log(appointment);
  res.render("event", { appo: appointment });
});
```

Renderiza a página de um compromisso específico.

Conclusão de Compromisso
javascript
Copiar código
app.post("/finish", async (req, res) => {
var id = req.body.id;
var result = await AppointmentService.Finish(id);
res.redirect("/");
});
Marca um compromisso como concluído.

Listagem de Compromissos
javascript
Copiar código
app.get("/list", async (req, res) => {
var appos = await AppointmentService.GetAll(true);
res.render("list", { appos });
});
Renderiza a lista de compromissos.

Busca de Compromissos
javascript
Copiar código
app.get("/searchresult", async (req, res) => {
var appos = await AppointmentService.Search(req.query.search);
res.render("list", { appos });
});
Busca compromissos por CPF ou nome.

4. Notificações
   javascript
   Copiar código
   var pollTime = 1000 _ 60 _ 5;

setInterval(async () => {
await AppointmentService.SendNotification();
}, pollTime);
Configura o envio de notificações a cada 5 minutos.

5. Início do Servidor
   javascript
   Copiar código
   app.listen(3000, () => {
   console.log("Servidor rodando!");
   });
   Inicia o servidor na porta 3000.

Como Usar
Clone o repositório.
Instale as dependências com npm install.
Inicie o servidor com npm start.
