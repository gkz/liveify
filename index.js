var LiveScript = require('livescript');
var through = require('through');
var objectAssign = require('object-assign');

// Consider files as livescript if they end in ".ls"
var IS_LS = /\.ls$/i;

module.exports = function (opts) {
  return function (file) {
    if (!IS_LS.test(file)) return through();
    
    var data = '';
    return through(write, end);
    
    function write (buf) { data += buf }
    function end () {
        try {
          var defaults = {
            'filename': file,
            'const': false,
            'bare': true
          };

          var js = LiveScript.compile(data, objectAssign(defaults, opts));
          this.queue(js);
        } catch (e) {
          this.emit('error', e);
        }
        this.queue(null);
    }
  }
};
