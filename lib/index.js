'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _template = require('./template');

var _template2 = _interopRequireDefault(_template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var version = '1.2.6';

var NodeTplPlus = function () {
  function NodeTplPlus(options) {
    _classCallCheck(this, NodeTplPlus);

    this.data = {};
    this.tpls = {};
    this.scripts = {};
    this.options = Object.assign({
      openTag: '<?',
      closeTag: '?>',
      library: 'commonjs' // umd | amd | cmd | commonjs | var | es
    }, options);
    return this;
  }

  /**
   * resort the content of template
   * @method _fetch
   * @param  {String} html template content
   * @return {Object}      an object resorted
   */


  _createClass(NodeTplPlus, [{
    key: '_fetch',
    value: function _fetch(html) {
      var cache = {};
      var jsExp = /<script\b[^>]*>([^<]*(?:(?!<\/script>)<[^<]*)*)<\/script>/igm;
      var cssExp = /<style\b[^>]*>([^<]*(?:(?!<\/style>)<[^<]*)*)<\/style>/igm;
      var getTemplate = function getTemplate(html) {
        var list = {};
        var regExp = /<template(?:.*name=['"]([^'"]+)*)?\b[^>]*>([^<]*(?:(?!<\/template>)<[^<]*)*)<\/template>/igm;
        var temp = html.replace(regExp, function (all, name, code) {
          if (name) {
            list[name] = code;
          }
          return '';
        });
        if (list.main) {
          cache.__libs = {
            _imports: temp.match(/import\s+(?:.* from\s+)?(['"]).*\1\s*;/g),
            _requires: temp.match(/require\s*\(\s*(['"]).*\1\s*\)\s*;/g)
          };
        } else {
          list.main = html;
        }
        return list;
      };
      var list = getTemplate(html);
      for (var tplname in list) {
        if (!Object.prototype.hasOwnProperty.call(list, tplname)) {
          continue;
        }
        var cssCode = '';
        var jsCode = '';
        var htmlCode = list[tplname];
        if (!htmlCode) {
          continue;
        }
        htmlCode = htmlCode.replace(cssExp, function (all, code) {
          return cssCode += '\n' + code, '';
        }).replace(jsExp, function (all, code) {
          return jsCode += '\n' + code, '';
        });
        cache[tplname] = {
          css: this._css(cssCode.trim(), tplname),
          html: this._html(htmlCode.trim(), tplname),
          js: this._js(jsCode.trim(), tplname)
        };
      }
      return cache;
    }

    /**
     * resort css code
     * @method _css
     * @param  {String} content css code
     * @param  {String} tplname template name
     * @return {String}         css code resorted
     */

  }, {
    key: '_css',
    value: function _css(content, tplname) {
      if (content) {
        content = content.replace(/'/g, '\\\'').replace(/\/\*(.|\n)*?\*\/|\r?\n/ig, '').replace(/([a-zA-Z0-9_\-#*\.:\s,\(\)'"<>=]*)(\{)/ig, function (a, b, c) {
          var sguid = void 0;
          if (tplname === 'main') {
            sguid = 'guid';
          } else {
            sguid = 'guid + duid';
          }
          b = b.trim();
          if (b === '') {
            return '#\' + ' + sguid + ' + \'' + c;
          } else {
            var _b = b.split(',');
            for (var i = 0; i < _b.length; i++) {
              _b[i] = _b[i].trim();
              _b[i] = '\\n#\' + ' + sguid + ' + \'' + (_b[i].startsWith(':') ? '' : ' ') + _b[i];
            }
            return _b.join(',') + c;
          }
        });
      }
      return content;
    }

    /**
     * resort js code
     * @method _js
     * @param  {String} content js code
     * @param  {String} tplname template name
     * @return {String}         js code resorted
     */

  }, {
    key: '_js',
    value: function _js(content, tplname) {
      if (content) {
        var jsarr = content.split(/\r?\n/g);
        for (var i = 0; i < jsarr.length; i++) {
          if (!jsarr[i]) continue;
          jsarr[i] = jsarr[i].replace(/(^|[^\.])include\(([^\)]*)\)/ig, function (a, b, c) {
            var _c = (c || '').split(',').map(function (v) {
              return v.trim();
            });
            return b + '$TPLS[' + _c[0] + '](' + (_c.length > 1 ? _c[1] : '$DATA') + ', guid)';
          });
        }
        content = jsarr.join('\n');
      }
      return content;
    }

    /**
     * resort html code
     * @method _html
     * @param  {String} content html code
     * @param  {String} tplname template name
     * @return {String}         html code resorted
     */

  }, {
    key: '_html',
    value: function _html(content, tplname) {
      if (content) {
        var getTag = function getTag(tag) {
          return tag.replace(/([\$\(\)\*\+\.\[\]\?\\\^\{\}\|])/g, '\\$1');
        };
        var openTag = getTag(this.options.openTag);
        var closeTag = getTag(this.options.closeTag);
        var html = content.split(new RegExp('(' + openTag + '[\\s\\S]*?' + closeTag + ')'));
        for (var i = 0; i < html.length; i++) {
          if (!html[i]) continue;
          var tagExp = new RegExp(openTag + '([\\s\\S]*?)' + closeTag, 'igm');
          if (tagExp.test(html[i])) {
            html[i] = html[i].replace(tagExp, '$1');
            html[i] = html[i].replace(/@([a-zA-Z\$_]+)/igm, '$DATA.$1');
            html[i] = html[i].replace(/echo\s+(.*?);/igm, '    _ += $1 || \'\';\n');
            if (html[i].startsWith('=')) {
              // 提取变量，判断是否 undefined
              html[i] = html[i].substring(1).trim();
              if (!/^\d/.test(html[i])) {
                var vars = (/^(\(*)([a-zA-Z\d_\$\s\.]+)/.exec(html[i]) || [0, 0, ''])[2];
                if (vars !== '') {
                  html[i] = '    if (typeof ' + vars + ' !== \'undefined\') {\n' + '      _ += (' + html[i] + ');\n' + '    }\n';
                } else {
                  html[i] = '    _ += (' + html[i] + ');\n';
                }
              } else {
                html[i] = '    _ += (' + html[i] + ');\n';
              }
            }
          } else {
            html[i] = '\n    _ += \'' + html[i].replace(/\\/g, '\\\\').replace(/\'/g, '\\\'').replace(/\r\n/g, '\n').replace(/\n/g, '\\n') + '\';\n';
          }
        }
        content = html.join('');
        content = content.replace(/\$ROOT/igm, '\'+ guid +\'');
        content = content.replace(/\$SUBROOT/igm, '\'+ guid + duid +\'');
      }
      //content = 'try{\n' +
      //  'with($DATA || {}){\n' + content.trim() + '\n}' +
      //  '} catch(e){ console.log(e.stack); }\n';
      content = 'try{\n' + content.trim() + '\n} catch(e){ console.log(e.stack); }\n';
      return content;
    }

    /**
     * Compile a template file
     * @method compile
     * @param  {String} path  pre compile path
     * @return {String}       content compiled
     */

  }, {
    key: 'compile',
    value: function compile(html) {
      return this._compile(this._fetch(html));
    }

    /**
     * compile template
     * @method _compile
     * @param  {Object}   cache template object
     * @return {String}         string compiled
     */

  }, {
    key: '_compile',
    value: function _compile(cache) {
      var html = '',
          tpls = [],
          scripts = [],
          libs = void 0;
      for (var i in cache) {
        var temp = void 0;
        if (!Object.prototype.hasOwnProperty.call(cache, i) || i === '__libs') {
          continue;
        }
        temp = '';
        temp += '  "' + i + '": function($DATA, guid){\n';
        temp += '    let _ = \'\';\n';
        temp += '    let duid = this.duid();\n';
        temp += '    guid = guid || this.guid();\n';
        if (cache[i].css) {
          temp += '    _ += \'<style>' + cache[i].css + '</style>\';\n';
        }
        if (cache[i].html) {
          temp += cache[i].html;
        }
        temp += '    if($DATA){\n';
        temp += '     this.datas[duid] = $DATA;\n';
        temp += '    }\n';
        if (cache[i].js) {
          temp += '    (function(scripts){\n';
          temp += '      let cache = typeof window !== \'undefined\' ? window : typeof global !== \'undefined\' ? global : {};\n';
          temp += '      cache._nodetpl_ = cache._nodetpl_ || {};\n';
          temp += '      cache._nodetpl_[guid + \'-\'+ duid] = scripts[\'' + i + '\'];\n';
          temp += '    })(this.scripts);\n';
          temp += '    _ += \'<script>\\n\';\n';
          temp += '    _ += \'(function(){\\n\';\n';
          temp += '    _ += \'  var cache = typeof window !== \\\'undefined\\\' ? window : typeof global !== \\\'undefined\\\' ? global : {};\\n\';\n';
          temp += '    _ += \'  cache._nodetpl_[\\\'\' + guid + \'-\' + duid + \'\\\'](\\\'\' + guid + \'\\\', \\\'\' + duid + \'\\\');\\n\';\n';
          temp += '    _ += \'  delete cache._nodetpl_[\\\'\' + guid + \'-\' + duid + \'\\\'];\\n\';\n';
          temp += '    _ += \'})();\\n\';\n';
          temp += '    _ += \'</script>\\n\';\n';
        }
        temp += '    return _;\n';
        temp += '  }.bind(this)';
        tpls.push(temp);
        temp = '';
        if (cache[i].js) {
          temp += '  "' + i + '": function(guid, duid){\n';
          temp += 'const ROOT = document.getElementById(guid);\n';
          temp += 'const SUBROOT = document.getElementById(guid + duid);\n';
          temp += 'var $TPLS = this.tpls;\n';
          temp += 'var $DATA = this.datas[duid];\n';
          temp += cache[i].js;
          temp += '  }.bind(this)';
        }
        scripts.push(temp);
      }
      if (!_template2.default[this.options.library]) {
        throw new Error('library option invalid: ' + this.options.library);
      }
      libs = cache.__libs || {};
      if (['amd', 'cmd'].indexOf(this.options.library) !== -1) {
        if (Array.isArray(libs._imports) && libs._imports.length > 0) {
          throw new Error('"import" was not supported on amd/cmd mode, you can use "require" instead.');
        }
      } else if (this.options.library === 'var') {
        if (Array.isArray(libs._imports) && libs._imports.length > 0 || Array.isArray(libs._requires) && libs._requires.length > 0) {
          throw new Error('"import", "require" was not supported on var mode.');
        }
      }
      html = _template2.default[this.options.library](tpls, scripts, libs);
      return html;
    }
  }]);

  return NodeTplPlus;
}();

NodeTplPlus.version = version;

exports.default = NodeTplPlus;