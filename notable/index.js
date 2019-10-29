const express = require('express');

const appointmentService = require('./services/appointmentService');
const doctorService = require('./services/doctorService');
const appointmentsModel = require('./models/Appointments');
const doctorsModel = require('./models/Doctors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded());

const doctorsRouter = express.Router();
doctorsRouter.get('/', (req, res) => {
  res.json(doctorsModel.getAllDoctors());
});

const appointmentsRouter = express.Router();
appointmentsRouter.get('/:doctorId/:day', (req, res) => {
  res.json(appointmentsModel.getAppointments(req.params['doctorId'], req.params['day']));
});

appointmentsRouter.delete('/:doctorId/:appointmentId', (req, res) => {
  appointmentsModel.deleteAppointment(req.params['appointmentId'], req.params['doctorId']);
  res.send(200);
});

appointmentsRouter.post('/:doctorId', (req, res) => {
  appointmentsModel.addAppointment(req.params['doctorId'], req.params['day']);
  res.send(200);
});

app.use('/doctors', doctorsRouter);
app.use('/appointments', appointmentsRouter);

app.listen(port, () => console.log(`app listening on port ${port}!`))
