var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var utils = require("../helpers/http-helpers");
var getHandler = require("../web/get-handler");

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

//step 1
exports.requestAddUrl = function(res, url){
  exports.accessList(res, url);
};

exports.accessList = function(res, url){
  console.log(url);
  fs.readFile(exports.paths.list, function(err, data){
    var allSites = data.toString();
    if(!exports.isUrlInList(url, allSites)){
      exports.addUrlToList(res, url);
      getHandler.serveAssets(res, utils.fullURL('loading.html'), 302);
    }else{
      exports.accessArchive(res, url);
    }
  });
};

exports.isUrlInList = function(url, list){
  return list.search(url) !== -1;
};

exports.addUrlToList = function(res, url){
  fs.appendFile(exports.paths.list, url + '\n', function(err){
    if(err){
      console.log(err);
    }else{
      console.log(url + ' is added to sites.txt');
    }
  });
};

exports.accessArchive = function(res, url){
  var targetArchive = exports.paths.archivedSites + '/' + url;
  console.log(targetArchive);
  fs.exists(targetArchive, function(exists){
    console.log(exists);
    if(exists){
      getHandler.serveAssets(res, targetArchive, 302);
    }else{
      utils.send500(res);
    }
  });
};

exports.downloadUrl = function(){
};
