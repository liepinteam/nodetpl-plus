'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var template = {};

template.es = function (tpls, scripts, libs) {
  return (libs._imports ? libs._imports.join('\n') + '\n' : '') + '\n' + (libs._requires ? libs._requires.join('\n') + '\n' : '') + '\nclass CoreClass {\n  constructor() {\n    this.tpls = {};\n    this.scripts = {};\n    this.datas = {};\n    this._initTpls()._initScripts();\n    return this;\n  }\n\n  _generate() {\n    return Math.random().toString().replace(\'.\', \'\');\n  }\n\n  _initTpls() {\n    this.tpls = {\n      ' + tpls.join(',') + '\n    };\n    return this;\n  }\n\n  _initScripts() {\n    this.scripts = {\n      ' + scripts.join(',') + '\n    };\n    return this;\n  }\n\n  duid() {\n    return \'_tpl_d_\' + this._generate();\n  }\n\n  guid() {\n    return \'_tpl_g_\' + this._generate();\n  }\n\n  render(data, guid) {\n    return this.tpls.main(data, guid || this.guid());\n  }\n}\n\nexport default {\n  render: data => new CoreClass().render(data)\n};';
};

template.commonjs = function (tpls, scripts, libs) {
  return (libs._imports ? libs._imports.join('\n') + '\n' : '') + '\n' + (libs._requires ? libs._requires.join('\n') + '\n' : '') + '\nclass CoreClass {\n  constructor() {\n    this.tpls = {};\n    this.scripts = {};\n    this.datas = {};\n    this._initTpls()._initScripts();\n    return this;\n  }\n\n  _generate() {\n    return Math.random().toString().replace(\'.\', \'\');\n  }\n\n  _initTpls() {\n    this.tpls = {\n      ' + tpls.join(',') + '\n    };\n    return this;\n  }\n\n  _initScripts() {\n    this.scripts = {\n      ' + scripts.join(',') + '\n    };\n    return this;\n  }\n\n  duid() {\n    return \'_tpl_d_\' + this._generate();\n  }\n\n  guid() {\n    return \'_tpl_g_\' + this._generate();\n  }\n\n  render(data, guid) {\n    return this.tpls.main(data, guid || this.guid());\n  }\n}\n\nmodule.exports = {\n  render: data => new CoreClass().render(data)\n};';
};

template.amd = template.cmd = function (tpls, scripts, libs) {
  return 'define(function(require, exports, module){\n  ' + (libs._requires ? libs._requires.join('\n') + '\n' : '') + '\n  class CoreClass {\n    constructor() {\n      this.tpls = {};\n      this.scripts = {};\n      this.datas = {};\n      this._initTpls()._initScripts();\n      return this;\n    }\n\n    _generate() {\n      return Math.random().toString().replace(\'.\', \'\');\n    }\n\n    _initTpls() {\n      this.tpls = {\n        ' + tpls.join(',') + '\n      };\n      return this;\n    }\n\n    _initScripts() {\n      this.scripts = {\n        ' + scripts.join(',') + '\n      };\n      return this;\n    }\n\n    duid() {\n      return \'_tpl_d_\' + this._generate();\n    }\n\n    guid() {\n      return \'_tpl_g_\' + this._generate();\n    }\n\n    render(data, guid) {\n      return this.tpls.main(data, guid || this.guid());\n    }\n  }\n\n  return {\n    render: data => new CoreClass().render(data)\n  };\n});';
};

template.var = function (tpls, scripts, libs) {
  return '((nodetpl) => {\n  class CoreClass {\n    constructor() {\n      this.tpls = {};\n      this.scripts = {};\n      this.datas = {};\n      this._initTpls()._initScripts();\n      return this;\n    }\n\n    _generate() {\n      return Math.random().toString().replace(\'.\', \'\');\n    }\n\n    _initTpls() {\n      this.tpls = {\n        ' + tpls.join(',') + '\n      };\n      return this;\n    }\n\n    _initScripts() {\n      this.scripts = {\n        ' + scripts.join(',') + '\n      };\n      return this;\n    }\n\n    duid() {\n      return \'_tpl_d_\' + this._generate();\n    }\n\n    guid() {\n      return \'_tpl_g_\' + this._generate();\n    }\n\n    render(data, guid) {\n      return this.tpls.main(data, guid || this.guid());\n    }\n  }\n  let url = nodetpl._getCurrentScript();\n  nodetpl.template[url] = new CoreClass();\n})(window.nodetpl);';
};

exports.default = template;