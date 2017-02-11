var path = require('path')
var PythonShell = require('python-shell')

exports.generateWithWord = function (word, output, next) {
  let execOptions = {
    scriptPath: path.join(__dirname, '../rotoscope'),
    args: [word, path.join(__dirname, '../GIF/Trump'), output]
  }

  PythonShell.run('generate.py', execOptions, next)
}
