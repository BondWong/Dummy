var nodemailer = require('nodemailer');

var chalk = require('chalk');

var mailOptions = {
  subject: 'Breaking News!'
};

var send = function(text) {
  var transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: process.env.from,
      pass: process.env.pass
    }
  });

  mailOptions.from = process.env.from;
  mailOptions.to = process.env.to;
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
