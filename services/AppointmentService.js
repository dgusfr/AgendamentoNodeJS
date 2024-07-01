var appointment = require("../models/Appointment");
var mongoose = require("mongoose");

const Appo = mongoose.model("Appointment", appointment);

class AppointmentService {
  async create(name, email, description, cpf, date, time) {
    var newAppo = new Appo({
      name,
      email,
      description,
      cpf,
      date,
      time,
    });
    try {
      await newAppo.save();
    } catch (err) {}
  }
}

module.exports = new AppointmentService();
