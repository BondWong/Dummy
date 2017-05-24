var streamIDs = {
  STREAM_IDS: [{
    name: 'CoinDesk',
    id: 1333467482
  }, {
    name: 'Chit_Koo',
    id: 860956164472938497
  }]
}

streamIDs.getStreamIDs = function() {
  var ids = [];
  this.STREAM_IDS.forEach(function(el, i) {
    ids.push(el.id)
  });

  return ids.toString();
}

module.exports = streamIDs;
