let template = {};

template.es = (tpls, scripts, libs) => `${libs ? libs + '\n' : ''}
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
    let $NODETPL = this;
    this.tpls = {
      ${tpls.join(',')}
    };
    return $NODETPL;
  }

  _initScripts() {
    let $NODETPL = this;
    this.scripts = {
      ${scripts.join(',')}
    };
    return $NODETPL;
  }

  duid() {
    return 'nodetpl_d_' + this._generate();
  }

  guid() {
    return 'nodetpl_g_' + this._generate();
  }

  escapeHtml(html) {
    return html ? html.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') : html;
  }

  render(data, guid) {
    return this.tpls.main(data, guid || this.guid());
  }
}

export default {
  render: data => new CoreClass().render(data)
};`;

template.commonjs = template.node = (tpls, scripts, libs) => `${libs ? libs + '\n' : ''}
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
    let $NODETPL = this;
    this.tpls = {
      ${tpls.join(',')}
    };
    return $NODETPL;
  }

  _initScripts() {
    let $NODETPL = this;
    this.scripts = {
      ${scripts.join(',')}
    };
    return $NODETPL;
  }

  duid() {
    return 'nodetpl_d_' + this._generate();
  }

  guid() {
    return 'nodetpl_g_' + this._generate();
  }

  escapeHtml(html) {
    return html.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  render(data, guid) {
    return this.tpls.main(data, guid || this.guid());
  }
}

module.exports = {
  render: data => new CoreClass().render(data)
};`;

template.amd = template.cmd = (tpls, scripts, libs) => `define(function(require, exports, module){
  ${libs ? libs + '\n' : ''}
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
      let $NODETPL = this;
      this.tpls = {
        ${tpls.join(',')}
      };
      return $NODETPL;
    }

    _initScripts() {
      let $NODETPL = this;
      this.scripts = {
        ${scripts.join(',')}
      };
      return $NODETPL;
    }

    duid() {
      return 'nodetpl_d_' + this._generate();
    }

    guid() {
      return 'nodetpl_g_' + this._generate();
    }

    escapeHtml(html) {
      return html.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
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
  ${libs ? libs + '\n' : ''}
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
      let $NODETPL = this;
      this.tpls = {
        ${tpls.join(',')}
      };
      return $NODETPL;
    }

    _initScripts() {
      let $NODETPL = this;
      this.scripts = {
        ${scripts.join(',')}
      };
      return $NODETPL;
    }

    duid() {
      return 'nodetpl_d_' + this._generate();
    }

    guid() {
      return 'nodetpl_g_' + this._generate();
    }

    escapeHtml(html) {
      return html.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    render(data, guid) {
      return this.tpls.main(data, guid || this.guid());
    }
  }
  let url = nodetpl._getCurrentScript();
  nodetpl.template[url] = new CoreClass();
})(window.nodetpl);`;

export default template;