var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var Promise = require('bluebird');
var wd = require('wd');
var http = require('http');

/**
 * The `safaridriver` does not always start accepting incoming connections immediately. As a result we have to "ping"
 * the driver to figure out when it is safe to start sending commands. This method pings the server, in a callback loop,
 * to determine when the server starts accepting incoming connections.
 *
 * @param {*} options The options to send to `http.get`.
 * @param {number} limit The maximum number of attempts to make before quitting.
 * @param {Function} done The callback performed when the Safari WebDriver is accepting connections.
 */
function ping(options, limit, done) {
  var attempts = 0;
  function error(e) {
    if (attempts <= limit) {
      http.get(options, done).on('error', error);
    }
  }
  http.get(options, done).on('error', error);
}

var SafariBrowser = function(baseBrowserDecorator, args, logger) {
  baseBrowserDecorator(this);

  this.name = 'Safari via WebDriver';
  var log = logger.create(this.name);

  var config = args.config || {
    hostname: '127.0.0.1',
    port: 4444,
    pathname: '/'
  };

  this._getOptions = function() {
    return [
      "-p", config.port.toString()
    ];
  }

  this._start = function(url) {
    var self = this;

    log.debug(url);
    self._execCommand(self._getCommand(), self._getOptions(url));
    ping(config, 100, function() {
      self.driver = wd.remote(config, 'promiseChain');
      self.browser = self.driver.init({});

      self.browser.get(url).done();
    });
  };

  var oldEmitAsync = this.emitAsync;

  this.emitAsync = function () {
    if (arguments[0] !== 'kill') {
      return oldEmitAsync.apply(this, arguments);
    } else {
      return new Promise (function (resolve, reject) {
        exec('osascript -e \'quit app "Safari"\'', function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
  };
};

SafariBrowser.prototype = {
  name: 'Safari',

  DEFAULT_CMD: {
    darwin: '/usr/bin/safaridriver'
  },
  ENV_CMD: 'SAFARI_BIN'
};

SafariBrowser.$inject = ['baseBrowserDecorator', 'args', 'logger'];


// PUBLISH DI MODULE
module.exports = {
  'launcher:Safari': ['type', SafariBrowser]
};
