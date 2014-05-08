var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var archive = require('../helpers/archive-helpers');
var utils = require("../helpers/http-helpers");

exports.serveAssets = function(res, asset, statusCode) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)

  var code = statusCode || 200;

  //step 2
  var extGate = function(res, asset){
    var ext = path.extname(asset);
    ext = ext || '.html';
    var type = utils.extensions[ext];
    if(ext){
      readAssets(res, asset, type);
    }else{
      utils.send404(res);
    }
  };

  //step 3
  var readAssets = function(res, asset, type){
    fs.readFile(asset, function(err, data){
      if(err){
        utils.send500(res);
      }else{
        var ext = path.extname(asset);
        var type = utils.extensions[ext];
        console.log(data);
        utils.sendResponse(res, code, type, data);
      }
    });
  };

  //step 1
  fs.exists(asset, function(exists){
    if(exists){
      extGate(res, asset);
    }else{
      utils.send404(res);
    }
  });
};
