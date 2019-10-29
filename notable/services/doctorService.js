const express = require('express');
const router = express.Router();

const doctorsModel = require('../models/Doctors');

router.get('/', (req, res) => {
  res.json(doctorsModel.getAllDoctors);
});

module.exports = router
