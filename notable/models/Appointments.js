const uuid = require('uuid/v4');
const _ = require('lodash');
const moment = require('moment');

const A_DAY_IN_MILL_SECS = 24 * 60 * 60 * 1000;

const initData = [
  {
    id: uuid(),
    patientFirstName: 'Git',
    patientLastName: 'Hub',
    kind: 'Follow-up',
    timestamp: moment('2019-10-27 4:15', 'YYYY-MM-DD HH:mm').valueOf()
  }, {
    id: uuid(),
    patientFirstName: 'Stack',
    patientLastName: 'Overflow',
    kind: 'Follow-up',
    timestamp: moment('2019-10-25 4:15', 'YYYY-MM-DD HH:mm').valueOf()
  }, {
    id: uuid(),
    patientFirstName: 'Segment',
    patientLastName: 'Fault',
    kind: 'New Patient',
    timestamp: moment('2019-10-24 4:15', 'YYYY-MM-DD HH:mm').valueOf()
  }
];

const linkTable = {
  1: [initData[0].id],
  2: [initData[1].id],
  3: [initData[2].id],
  4: []
};

const appointments = {};

_.map(initData, data => {
  appointments[data.id] = data;
});

function getAppointments(doctorId, day) {
  if (!_.has(linkTable, doctorId)) return [];
  return _.reduce(linkTable[doctorId], (r, appId) => {
    const appointment = appointments[appId];
    if (day + A_DAY_IN_MILL_SECS > appointment.timestamp && day <=  appointment.timestamp) r.push(appointment);
    return r;
  }, []);
}

function deleteAppointment(appointmentId, doctorId) {
  const hasAppointment = _.has(linkTable, doctorId);
  if (!hasAppointment) return;
  appointmentsOfDoctor = linkTable[doctorId];
  linkTable[doctorId] = _.remove(linkTable[doctorId], appoint => appoint.id == appointmentId);
  delete appointments[appointmentId]
}

function addAppointment(appointment, doctorId) {
  const timestamp = appointment.timestamp;
  if (parseInt(moment(timestamp).format('mm')) % 15 != 0) throw Exception('Invalid Time');

  if (_.size(linkTable[doctorId]) <= 2) {
    linkTable[doctorId].push(appointment);
    appointments[appointment.id] = appointment;
  }
  else {
    var cnt = 0;
    _.each(linkTable[doctorId], app => {
      if (app.timestamp == timestamp) cnt++;
    });

    if (cnt >= 3) throw Exception('Appointment exceed maximum');
    linkTable[doctorId].push(appointment);
    appointments[appointment.id] = appointment;
  }

  console.log(linkTable);
  console.log(appointments);
}

module.exports = {
  getAppointments,
  deleteAppointment,
  addAppointment
};
