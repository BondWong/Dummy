'use strict';

var Twitter = require('twitter');
require('dotenv').config();

var streamIDs = require('./streams/ids');
var streamFilter = require('./streams/filters');
var streamError = require('./streams/errors');

var streamParameters = {
  follow: streamIDs.getStreamIDs().toString()
};

var client = new Twitter({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token_key: process.env.access_token_key,
  access_token_secret: process.env.access_token_secret
});

client.stream('statuses/filter', streamParameters, function(stream){
  stream.on('data', streamFilter);
  stream.on('error', streamError);
});
