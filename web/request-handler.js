var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require("./http-helpers");


var fs = require('fs');

// closure functions 
var getAction = function(req, res){
  console.log(req.url);
  var homeDir = __dirname + '/public/';
  var targetFile = path.basename(req.url) || 'index.html';
  var asset = homeDir + targetFile;
  console.log('Now looking for asset: ' + asset);
  helpers.serveAssets(res, asset);
};

var postAction = function(req, res){
  helpers.sendResponse(res, 200, {}, 'Successful POST');
};

var optionsAction = function(req, res){
  helpers.sendResponse(res, 200, {}, 'Successfully connected!');
};

var actions = {
  'GET': getAction,
  'POST': postAction,
  'OPTIONS': optionsAction
};

exports.handleRequest = function (req, res) {

  var action = req.method;
  if(action){
    actions[action](req, res);
  }else{
    //404;
    helpers.send404(res);

  }
  //res.end(archive.paths.list);
};
