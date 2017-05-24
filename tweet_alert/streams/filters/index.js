var streamIDs = require('../ids');
var chalk = require('chalk');

let ids = new Set(streamIDs.getStreamIDs());
let breaking = /^BREAKING:.+/;

var streamFilter = function(tweet) {
  if (ids.has(tweet.user.id) && breaking.test(tweet.text)) {
    // send sms
  }
};

module.exports = streamFilter;
