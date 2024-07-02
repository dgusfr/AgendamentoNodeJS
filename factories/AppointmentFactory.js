// A Factory é responsável por processsar e transformar um agendamento simples em um formato específico.
class AppointmentFactory {
  // Método para construir um agendamento a partir de um objeto simples de agendamento
  Build(simpleAppointment) {
    // Extrai o dia, mês e ano da data do agendamento, ajustando o dia (+1)
    var day = simpleAppointment.date.getDate() + 1;
    var month = simpleAppointment.date.getMonth();
    var year = simpleAppointment.date.getFullYear();

    // Extrai a hora e os minutos do horário do agendamento
    var hour = Number.parseInt(simpleAppointment.time.split(":")[0]);
    var minutes = Number.parseInt(simpleAppointment.time.split(":")[1]);

    // Cria um objeto Date para a data e horário de início do agendamento
    var startDate = new Date(year, month, day, hour, minutes, 0, 0);

    // Cria um novo objeto de agendamento com as propriedades desejadas
    var appo = {
      id: simpleAppointment._id,
      title: simpleAppointment.name + " - " + simpleAppointment.description,
      start: startDate,
      end: startDate,
      notified: simpleAppointment.notified,
      email: simpleAppointment.email,
    };

    // Retorna o novo objeto de agendamento
    return appo;
  }
}

// Exporta uma nova instância da AppointmentFactory
module.exports = new AppointmentFactory();
