'use strict';

var streamIDs = {
  STREAM_IDS: [{
    name: 'CoinDesk',
    id: 1333467482
  }]
}

streamIDs.getStreamIDs = function() {
  var ids = [];
  this.STREAM_IDS.forEach(function(el, i) {
    ids.push(el.id)
  });

  return ids;
}

module.exports = streamIDs;
