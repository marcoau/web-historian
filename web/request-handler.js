var path = require('path');
var fs = require('fs');
var qs = require('querystring');
var archive = require('../helpers/archive-helpers');
var utils = require("../helpers/http-helpers");
var getHandler = require("./get-handler");

var fetcher = require('../workers/htmlfetcher');

// closure functions 
var getAction = function(req, res){

  console.log(req.url);
  if(req.url === '/'){
    console.log('index');
    //index
    getHandler.serveAssets(res, utils.fullURL('/index.html'));
  }else if(!(path.extname(req.url) in utils.extensions)){
    //archived stuff
    getHandler.serveAssets(res, utils.archiveURL(req.url));
  }else{
    //not archived stuff
    console.log(utils.fullURL(req.url));
    getHandler.serveAssets(res, utils.fullURL(req.url));
  }
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
  // fetcher.startCron();
  console.log('Request type: ' + req.method);
  var action = req.method;
  if(action){
    actions[action](req, res);
  }else{
    utils.send404(res);
  }
};
