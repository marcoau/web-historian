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

exports.extensions = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg'
};

exports.fullURL = function(url){
  var homeDir = path.normalize(__dirname + '/../web/public/');
  var targetFile = path.basename(url) || 'index.html';
  return homeDir + targetFile;
};

exports.archiveURL = function(url){
  var homeDir = path.normalize(__dirname + '/../archives/sites/');
  var targetFile = path.basename(url) || 'index.html';
  return homeDir + targetFile;
};

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
