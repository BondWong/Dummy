var chalk = require('chalk');

var streamFilter = function(tweet) {
  console.log(chalk.green(JSON.stringify(tweet)));
};

module.exports = streamFilter;
