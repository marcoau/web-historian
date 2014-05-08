var path = require('path');
var fs = require('fs');
var qs = require('querystring');
var archive = require('../helpers/archive-helpers');
var utils = require("../helpers/http-helpers");
var getHandler = require("./get-handler");
// var postHandler = require("./post-handler");
// // var fs = require('fs');

// closure functions 
var getAction = function(req, res){
  getHandler.serveAssets(res, utils.fullURL(req.url));
};

var postAction = function(req, res){
  var data = '';
  req.on('data', function(chunk){
    data += chunk;
  });
  req.on('end', function(){
    var newSite = qs.parse(data).url;
    console.log('Data received is: ' + newSite);
    archive.requestAddUrl(res, newSite);
  });

  // getHandler.serveAssets(res, utils.fullURL('loading.html'), 302);

  //special case for loading.html (302)
};

var optionsAction = function(req, res){
  utils.sendResponse(res, 200, {}, 'Successfully connected!');
};

var actions = {
  'GET': getAction,
  'POST': postAction,
  'OPTIONS': optionsAction
};

exports.handleRequest = function (req, res) {
  console.log('Request type: ' + req.method);
  var action = req.method;
  if(action){
    actions[action](req, res);
  }else{
    utils.send404(res);

  }
  //res.end(archive.paths.list);
};
