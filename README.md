nodetpl-plus
===

[![Build Status](https://secure.travis-ci.org/pillys/nodetpl-plus.png?branch=master)](https://travis-ci.org/pillys/nodetpl-plus)

A powerful, efficient, easy to use, funny JavaScript template engine.

## Why use nodetpl-plus?

  * Free: Open source, free use under MIT license
  * Superior performance: Super-fast run, like lightning analytical efficiency
  * Native js syntax: Yes, it's HTML & JavaScript++, not like learning a new language as painful
  * Precompiled: Js file compiled in advance, reducing the burden on the browser running
  * Multiple templates: Support complex multi-template, include step
  * Template leveled CSS/JS: Original CSS / JS with the package mechanism, independent of the template can have its own CSS / JS
  * **ES6: ES6 is supported**
  * Quick learning: Just 10 minutes from entry to proficient
  * Good compatibility: Compatible with all major browsers, IE, Firefox, Chrome, Safari etc
  
## Install
```
npm install nodetpl-plus --save
```
  
## Usage

```
var NodeTplPlus = require('nodetpl-plus').default;
// or
//import NodeTplPlus from 'nodetpl-plus';

var result = new NodeTplPlus({
  library: 'commonjs'
}).compile('template html code');
```

### Detailed documentation

  Go to the official site: <http://www.nodetpl.com/nodetpl-plus>

## Questions?

If you have any questions, please feel free to ask through [New Issue](https://github.com/pillys/nodetpl-plus/issues/new).

### License

  nodetpl-plus is available under the terms of the [MIT](LICENSE) License.
