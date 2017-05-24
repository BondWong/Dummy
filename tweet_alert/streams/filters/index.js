var streamIDs = require('../ids');
var email = require('../../email');

let ids = new Set(streamIDs.getStreamIDs());
let breaking = /^BREAKING:.+/;

var streamFilter = function(tweet) {
  if (ids.has(tweet.user.id) && breaking.test(tweet.text)) {
    email.send(tweet.text);
  }
};

module.exports = streamFilter;

// streamFilter({
//   user: {
//     id: 1333467482
//   },
//   text: 'BREAKING: Deloitte\'s @LoryKehoe describes how blockchain \"beautifully\" solves trade finance problems. #consensus2017 https://t.co/KDf2dMz0Yj'
// });
