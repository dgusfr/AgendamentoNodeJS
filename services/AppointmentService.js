// Importa o modelo de Appointment, a biblioteca mongoose para manipulação do banco de dados,
// a fábrica de Appointment e o nodemailer para envio de emails
var appointment = require("../models/Appointment");
var mongoose = require("mongoose");
var AppointmentFactory = require("../factories/AppointmentFactory");
var mailer = require("nodemailer");

// Cria um modelo de Appointment usando o mongoose
const Appo = mongoose.model("Appointment", appointment);

// Define a classe AppointmentService com vários métodos para gerenciar os agendamentos
class AppointmentService {
  // Método para criar um novo agendamento
  async Create(name, email, description, cpf, date, time) {
    var newAppo = new Appo({
      name,
      email,
      description,
      cpf,
      date,
      time,
      finished: false,
      notified: false,
    });
    try {
      await newAppo.save();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  // Método para obter todos os agendamentos, podendo filtrar apenas os não finalizados
  async GetAll(showFinished) {
    if (showFinished) {
      return await Appo.find();
    } else {
      var appos = await Appo.find({ finished: false });
      var appointments = [];

      appos.forEach((appointment) => {
        if (appointment.date != undefined) {
          appointments.push(AppointmentFactory.Build(appointment));
        }
      });

      return appointments;
    }
  }

  // Método para obter um agendamento específico pelo seu ID
  async GetById(id) {
    try {
      var event = await Appo.findOne({ _id: id });
      return event;
    } catch (err) {
      console.log(err);
    }
  }

  // Método para marcar um agendamento como finalizado
  async Finish(id) {
    try {
      await Appo.findByIdAndUpdate(id, { finished: true });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  // Método para buscar agendamentos por email ou CPF
  async Search(query) {
    try {
      var appos = await Appo.find().or([{ email: query }, { cpf: query }]);
      return appos;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  // Método para enviar notificações de agendamentos próximos
  async SendNotification() {
    var appos = await this.GetAll(false);

    var transporter = mailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 25,
      auth: {
        user: "3edb05efa41bb6",
        pass: "f4d4d2222c6acd",
      },
    });

    appos.forEach(async (app) => {
      var date = app.start.getTime();
      var hour = 1000 * 60 * 60;
      var gap = date - Date.now();

      if (gap <= hour) {
        if (!app.notified) {
          await Appo.findByIdAndUpdate(app.id, { notified: true });

          transporter
            .sendMail({
              from: "Victor Lima <victor@guia.com.br>",
              to: app.email,
              subject: "Sua consulta vai acontecer em breve!",
              text: "Conteúdo qualquer!!!!! Sua consulta vai acontecer em 1h",
            })
            .then(() => {
              // Email enviado com sucesso
            })
            .catch((err) => {
              // Erro ao enviar email
              console.log(err);
            });
        }
      }
    });
  }
}

// Exporta uma nova instância do AppointmentService
module.exports = new AppointmentService();
