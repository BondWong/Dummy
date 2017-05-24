var nodemailer = require('nodemailer');
var env = require('dotenv').config('../../.env');
var chalk = require('chalk');

var mailOptions = {
  subject: 'Breaking News!'
};

var send = function(text) {
  var transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: env.parsed.from,
      pass: env.parsed.pass
    }
  });

  mailOptions.from = env.parsed.from;
  mailOptions.to = env.parsed.to;
  mailOptions.text = text;
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(chalk.red(error));
    } else {
      console.log(chalk.green('Email sent: ' + info.response));
    }
  });
}

module.exports = {
  send: send
};
