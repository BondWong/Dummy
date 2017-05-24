var Twitter = require('twitter');
var env = require('dotenv').config();

var streamIDs = require('./streams/ids');
var streamFilter = require('./streams/filters');
var streamError = require('./streams/errors');

var streamParameters = {
  follow: streamIDs.getStreamIDs().toString()
};

var client = new Twitter({
  consumer_key: env.parsed.consumer_key,
  consumer_secret: env.parsed.consumer_secret,
  access_token_key: env.parsed.access_token_key,
  access_token_secret: env.parsed.access_token_secret
});

client.stream('statuses/filter', streamParameters, function(stream){
  stream.on('data', streamFilter);
  stream.on('error', streamError);
});
