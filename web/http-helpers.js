var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.extension = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg'
};

exports.serveAssets = function(res, asset) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)

  //step 2
  var extGate = function(res, asset){
    var ext = path.extname(asset);
    var type = exports.extension[ext];
    if(ext){
      readAssets(res, asset, type);
    }else{
      exports.send404(res);
    }
  };

  //step 3
  var readAssets = function(res, asset, type){
    fs.readFile(asset, function(err, data){
      if(err){
        exports.send500(res);
      }else{
        var ext = path.extname(asset);
        var type = exports.extension[ext];
        exports.sendResponse(res, 200, type, data);
      }
    });
  };

  //step 1
  fs.exists(asset, function(exists){
    if(exists){
      extGate(res, asset);
    }else{
      exports.send404(res);
    }
  });
};

//step 4
exports.sendResponse = function(res, statusCode, type, responseData){
  var extendedHeaders = _.extend(headers, {'Content-Type': type});
  res.writeHead(statusCode, extendedHeaders);
  res.end(responseData);
};

exports.send404 = function(res){
  exports.sendResponse(res, 404, {}, 'Not Found');
};

exports.send500 = function(res){
  exports.sendResponse(res, 500, {}, 'Internal Server Error');
};
