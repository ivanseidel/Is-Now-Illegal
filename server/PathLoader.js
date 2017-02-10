'use strict'
var fs = require('fs')
var path = require('path')

//
// Loads all files and returns in an object-form like:
// {
//  somemodule: require('somemodule.js'),
//  ...
// }
//

exports.load = function loadModules (dir, loaded) {
  // Default to creat a new object
  loaded = (typeof loaded) === 'object' ? loaded : {}

  // Read all files from that path and load into modules
  fs.readdirSync(dir).forEach(function (file) {
    if (file.indexOf('.js') < 0) {
      return
    }

    var mod = require(path.join(dir, file))
    var name = path.basename(file, '.js')

    loaded[name] = mod
  })

  return loaded
}
