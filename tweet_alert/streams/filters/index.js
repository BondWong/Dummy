var streamIDs = require('../ids');
var email = require('../../email');
var chalk = require('chalk');

let ids = new Set(streamIDs.getStreamIDs());
let breaking = /^BREAKING:.+/;

var streamFilter = function(tweet) {
  if (ids.has(tweet.user.id) && breaking.test(tweet.text)) {
    console.log(chalk.green(tweet.text));
    email.send(tweet.text);
  } else {
    console.log(chalk.white(tweet.text));
  }
};

module.exports = streamFilter;

// streamFilter({
//   user: {
//     id: 1333467482
//   },
//   text: 'BREAKING: ICOs Going Mainstream? Chat App Kik to Launch Token Sale http://www.coindesk.com/icos-going-mainstream-chat-app-kik-launch-token-sale/ …'
// });
