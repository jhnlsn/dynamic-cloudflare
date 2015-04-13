var Promise = require('bluebird');
var join = Promise.join;
var conf = require('config');
var _ = require('lodash');

var request = Promise.promisify(require('request'));

setInterval(checkZoneIp, 30000);

function checkZoneIp() {
  join(getZone(), getMyIp(), function(zone, ip){
    console.log(zone.content, ip);
    if(zone.content != ip) {
      console.log('need to update zone');
    }
  });
}

function getZone() {
  var options = {
    "url": conf.api.url,
    "method":"POST",
    "json":true,
    "form": {
      "a": "rec_load_all",
      "tkn":conf.api.key,
      "email":conf.api.email,
      "z": conf.zone_name
    }
  };

  var resp = request(options);

  return resp.spread(function(resp, body){
    return _.findWhere(body.response.recs.objs, {"name": conf.a_rec, "type":"A"});
  });
}

function getMyIp() {
  return request('http://curlmyip.com/').get(1).then(function(body){
    return body.trim();
  });
}