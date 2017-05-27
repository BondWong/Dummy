'use strict';

var chalk = require('chalk');

var streamError = function(tweet) {
  console.log(chalk.red(tweet));
};

module.exports = streamError;
