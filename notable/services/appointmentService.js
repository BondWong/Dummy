const express = require('express');
const router = express.Router();

const appointmentsModel = require('../models/Appointments');

router.get('/:doctorId/:day', (req, res) => {
  return appointmentsModel.getAppointments(req.params['doctorId'], req.params['day']);
});

router.delete('/:doctorId/:appointmentId', (req, res) => {
  appointmentsModel.deleteAppointment(req.params['appointmentId'], req.params['doctorId']);
});

router.post('/:doctorId', (req, res) => {
  appointmentsModel.addAppointment(req.params['doctorId'], req.params['day']);
});

module.exports = router
