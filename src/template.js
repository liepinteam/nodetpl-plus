let template = {};

template.es = (tpls, scripts, libs) => `${libs._imports ? libs._imports.join('\n') + '\n' : ''}
${libs._requires ? libs._requires.join('\n') + '\n' : ''}
class CoreClass {
  constructor() {
    this.tpls = {};
    this.scripts = {};
    this.datas = {};
    this._initTpls()._initScripts();
    return this;
  }

  _generate() {
    return Math.random().toString().replace('.', '');
  }

  _initTpls() {
    this.tpls = {
      ${tpls.join(',')}
    };
    return this;
  }

  _initScripts() {
    this.scripts = {
      ${scripts.join(',')}
    };
    return this;
  }

  duid() {
    return '_tpl_d_' + this._generate();
  }

  guid() {
    return '_tpl_g_' + this._generate();
  }

  render(data, guid) {
    return this.tpls.main(data, guid || this.guid());
  }
}

export default {
  render: data => new CoreClass().render(data)
};`;

template.commonjs = (tpls, scripts, libs) => `${libs._imports ? libs._imports.join('\n') + '\n' : ''}
${libs._requires ? libs._requires.join('\n') + '\n' : ''}
class CoreClass {
  constructor() {
    this.tpls = {};
    this.scripts = {};
    this.datas = {};
    this._initTpls()._initScripts();
    return this;
  }

  _generate() {
    return Math.random().toString().replace('.', '');
  }

  _initTpls() {
    this.tpls = {
      ${tpls.join(',')}
    };
    return this;
  }

  _initScripts() {
    this.scripts = {
      ${scripts.join(',')}
    };
    return this;
  }

  duid() {
    return '_tpl_d_' + this._generate();
  }

  guid() {
    return '_tpl_g_' + this._generate();
  }

  render(data, guid) {
    return this.tpls.main(data, guid || this.guid());
  }
}

module.exports = {
  render: data => new CoreClass().render(data)
};`;

template.amd = template.cmd = (tpls, scripts, libs) => `define(function(require, exports, module){
  ${libs._requires ? libs._requires.join('\n') + '\n' : ''}
  class CoreClass {
    constructor() {
      this.tpls = {};
      this.scripts = {};
      this.datas = {};
      this._initTpls()._initScripts();
      return this;
    }

    _generate() {
      return Math.random().toString().replace('.', '');
    }

    _initTpls() {
      this.tpls = {
        ${tpls.join(',')}
      };
      return this;
    }

    _initScripts() {
      this.scripts = {
        ${scripts.join(',')}
      };
      return this;
    }

    duid() {
      return '_tpl_d_' + this._generate();
    }

    guid() {
      return '_tpl_g_' + this._generate();
    }

    render(data, guid) {
      return this.tpls.main(data, guid || this.guid());
    }
  }

  return {
    render: data => new CoreClass().render(data)
  };
});`;

template.var = (tpls, scripts, libs) => `((nodetpl) => {
  class CoreClass {
    constructor() {
      this.tpls = {};
      this.scripts = {};
      this.datas = {};
      this._initTpls()._initScripts();
      return this;
    }

    _generate() {
      return Math.random().toString().replace('.', '');
    }

    _initTpls() {
      this.tpls = {
        ${tpls.join(',')}
      };
      return this;
    }

    _initScripts() {
      this.scripts = {
        ${scripts.join(',')}
      };
      return this;
    }

    duid() {
      return '_tpl_d_' + this._generate();
    }

    guid() {
      return '_tpl_g_' + this._generate();
    }

    render(data, guid) {
      return this.tpls.main(data, guid || this.guid());
    }
  }
  let url = nodetpl._getCurrentScript();
  nodetpl.template[url] = new CoreClass();
})(window.nodetpl);`;

export default template;