'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (content, namespace, ignore) {
  var parsed = _css2.default.parse(content);
  _traverse2.default.forEach(parsed, function (node) {
    if (this.key === 'selectors') {
      this.update(node.map(function (v) {
        if (ignore && v.startsWith(ignore)) {
          v = v.replace(ignore, '');
          return namespace + v;
        } else {
          return namespace + ' ' + v;
        }
      }));
    }
  });
  return _css2.default.stringify(parsed);
};

var _css = require('css');

var _css2 = _interopRequireDefault(_css);

var _traverse = require('traverse');

var _traverse2 = _interopRequireDefault(_traverse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }