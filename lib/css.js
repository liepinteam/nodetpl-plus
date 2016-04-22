'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (content, namespace, ignore) {
  var parsed = (0, _cssParse2.default)(content);
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
  return (0, _cssStringify2.default)(parsed);
};

var _cssParse = require('css-parse');

var _cssParse2 = _interopRequireDefault(_cssParse);

var _cssStringify = require('css-stringify');

var _cssStringify2 = _interopRequireDefault(_cssStringify);

var _traverse = require('traverse');

var _traverse2 = _interopRequireDefault(_traverse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }