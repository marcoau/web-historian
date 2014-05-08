var fs = require('fs');
var _ = require('underscore');
var request = require('request');
var cron = require('cron');
var time = require('time');
var archive = require('../helpers/archive-helpers');

var CronJob = cron.CronJob;

exports.cronDownloader = new CronJob('0 0 * * * *', function(){
  //do the work!
  console.log('cron works');
  exports.downloadSites();
}, function() {
  console.log('cron ends');
},
true,
"America/Los_Angeles"
);

// exports.startCron = function(){
//   console.log('start cron');
//   exports.cronDownloader.start();
// };

exports.downloadSites = function(){
  fs.readFile(archive.paths.list, function(err, data){
    var sites = data.toString().split('\n');
    _.each(sites, function(site){
      exports.downloadSite(site);
    });
  });
};

exports.downloadSite = function(url){
  request('http://' + url, function (error, res, body) {
    if (!error && res.statusCode == 200) {
      // console.log(body);
      archive.saveToArchive(url, body);
    }
  });
};
