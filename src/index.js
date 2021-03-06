'use strict';

import template from './template';
import css from './css';

let version = '4.3.5';

class NodeTplPlus {
  constructor(options) {
    this.data = {};
    this.tpls = {};
    this.scripts = {};
    this.options = Object.assign({
      openTag: '<?',
      closeTag: '?>',
      library: 'commonjs', // umd | amd | cmd | commonjs | node | var | es
      map: function(statements) {
        return statements;
      },
      beforeCompile: function(html) {
        return html;
      },
      afterCompile: function(html) {
        return html;
      }
    }, options);
    return this;
  }

  /**
   * resort the content of template
   * @method _fetch
   * @param  {String} html template content
   * @return {Object}      an object resorted
   */
  _fetch(html) {
    let cache = {};
    let jsExp = /<script\b[^>]*>([^<]*(?:(?!<\/script>)<[^<]*)*)<\/script>/igm;
    let cssExp = /<style\b[^>]*>([^<]*(?:(?!<\/style>)<[^<]*)*)<\/style>/igm;
    let getTemplate = function(html) {
      let list = {};
      let regExp = /<template(?:.*name=['"]([^'"]+)*)?\b[^>]*>([^<]*(?:(?!<\/template>)<[^<]*)*)<\/template>/igm;
      let temp = html.replace(regExp, function(all, name, code) {
        if (name) {
          list[name] = code;
        }
        return '';
      });
      if (list.main) {
        cache.__libs = temp.trim();
      } else {
        list.main = html;
      }
      return list;
    };
    html = html.replace(/<!--[\w\W\r\n]*?-->/igm, ''); // annotation
    let list = getTemplate(html);
    for (let tplname in list) {
      if (!Object.prototype.hasOwnProperty.call(list, tplname)) {
        continue;
      }
      let cssCode = '';
      let jsCode = '';
      let htmlCode = list[tplname];
      if (!htmlCode) {
        continue;
      }
      if (this.options.library !== 'node') {
        htmlCode = htmlCode
          .replace(cssExp, (all, code) => (cssCode += '\n' + code, ''))
          .replace(jsExp, (all, code) => (jsCode += '\n' + code, ''));
      }
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
  _css(content, tplname) {
    if (content) {
      let sguid;
      let idname = '####SGUID####';
      if (tplname === 'main') {
        sguid = 'guid';
      } else {
        sguid = 'guid + duid';
      }
      content = css(content, idname, '$ROOT').replace(/\r?\n/g, '').replace(/'/g, '\\\'').replace(new RegExp(idname, 'g'), '#\' + ' + sguid + ' + \'');
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
  _js(content, tplname) {
    if (content) {
      let jsarr = content.split(/\r?\n/g);
      for (let i = 0; i < jsarr.length; i++) {
        if (!jsarr[i]) continue;
        jsarr[i] = jsarr[i].replace(/(^|[^\.])include\(([^\)]*)\)/ig, function(a, b, c) {
          let _c = (c || '').split(',').map(v => v.trim());
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
  _html(content, tplname) {
    if (content) {
      let getTag = function(tag) {
        return tag.replace(/([\$\(\)\*\+\.\[\]\?\\\^\{\}\|])/g, '\\$1');
      };
      let openTag = getTag(this.options.openTag);
      let closeTag = getTag(this.options.closeTag);
      let html;
      html = content.split(new RegExp('(' + openTag + '[\\s\\S]*?' + closeTag + ')'));
      for (let i = 0; i < html.length; i++) {
        if (!html[i]) continue;
        let tagExp = new RegExp(openTag + '([\\s\\S]*?)' + closeTag, 'igm');
        if (tagExp.test(html[i])) {
          html[i] = html[i].replace(tagExp, '$1');
          html[i] = this.options.map(html[i]); // use user map rules
          html[i] = html[i].replace(/@([a-zA-Z\$_]+)/igm, '$DATA.$1');
          html[i] = html[i].replace(/echo\s+(.*?);/igm, '    _ += $1 || \'\';\n');
          if (html[i].startsWith('=')) {
            var eqhtml, safeeq = true;
            // undefined or not
            html[i] = html[i].substring(1).trim();
            if (html[i].startsWith('=')) {
              // safeeq, safe html
              safeeq = false;
              html[i] = html[i].substring(1).trim();
            }
            eqhtml = safeeq ? '$NODETPL.escapeHtml(' + html[i] + ')' : '(' + html[i] + ')';
            html[i] = '    _eqstring = ' + eqhtml + ';\n' +
              '    if (typeof _eqstring === \'undefined\') {\n' +
              '      _ += \'\';\n' +
              '    } else {\n' +
              '      _ += _eqstring;\n' +
              '    }\n';
          }
        } else {
          html[i] = '\n    _ += \'' + html[i]
            .replace(/\\/g, '\\\\')
            .replace(/\'/g, '\\\'')
            .replace(/\r\n/g, '\n')
            .replace(/\n/g, '\\n') + '\';\n';
        }
      }
      content = html.join('');
      content = content.replace(/\$ROOT/igm, '\'+ guid +\'');
      content = content.replace(/\$SUBROOT/igm, '\'+ guid + duid +\'');
    }
    //content = 'try{\n' +
    //  'with($DATA || {}){\n' + content.trim() + '\n}' +
    //  '} catch(e){ console.log(e.stack); }\n';
    content = 'try{\nvar _eqstring;\n' + content.trim() + '\n} catch(e){ console.log(e.stack); }\n';
    return content;
  }

  /**
   * Compile a template file
   * @method compile
   * @param  {String} path  pre compile path
   * @return {String}       content compiled
   */
  compile(html) {
    var result;
    html = this.options.beforeCompile(html);
    result = this._compile(this._fetch(html));
    result = this.options.afterCompile(result);
    return result;
  }

  /**
   * compile template
   * @method _compile
   * @param  {Object}   cache template object
   * @return {String}         string compiled
   */
  _compile(cache) {
    let html = '',
      tpls = [],
      scripts = [],
      libs;
    for (let i in cache) {
      let temp;
      if (!Object.prototype.hasOwnProperty.call(cache, i) || i === '__libs') {
        continue;
      }
      temp = '';
      temp += '  "' + i + '": function($DATA, guid){\n';
      temp += '    let _ = \'\';\n';
      temp += '    let duid = $NODETPL.duid();\n';
      temp += '    guid = guid || $NODETPL.guid();\n';
      if (cache[i].css) {
        temp += '    _ += \'<style>' + cache[i].css + '</style>\';\n';
      }
      if (cache[i].html) {
        temp += cache[i].html;
      }
      temp += '    if($DATA){\n';
      temp += '     $NODETPL.datas[duid] = $DATA;\n';
      temp += '    }\n';
      if (cache[i].js) {
        temp += '    (function(scripts){\n';
        temp += '      let cache = typeof window !== \'undefined\' ? window : typeof global !== \'undefined\' ? global : {};\n';
        temp += '      cache._nodetpl_ = cache._nodetpl_ || {};\n';
        temp += '      cache._nodetpl_[guid + \'-\'+ duid] = scripts[\'' + i + '\'];\n';
        temp += '    })($NODETPL.scripts);\n';
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
      if (cache[i].js) {
        temp = '';
        temp += '  "' + i + '": function(guid, duid){\n';
        temp += 'const ROOT = document.getElementById(guid);\n';
        temp += 'const SUBROOT = document.getElementById(guid + duid);\n';
        temp += 'var $TPLS = $NODETPL.tpls;\n';
        temp += 'var $DATA = $NODETPL.datas[duid];\n';
        temp += cache[i].js;
        temp += '  }.bind(this)';
        scripts.push(temp);
      }
    }
    if (!template[this.options.library]) {
      throw new Error('library option invalid: ' + this.options.library);
    }
    libs = (cache.__libs || '').trim();
    html = template[this.options.library](tpls, scripts, libs);
    return html;
  }
}

NodeTplPlus.version = version;
export default NodeTplPlus;