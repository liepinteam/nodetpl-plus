import parser from 'css-parse';
import stringify from 'css-stringify';
import traverse from 'traverse';

export default function(content, namespace, ignore) {
  var parsed = parser(content);
  traverse.forEach(parsed, function(node) {
    if (this.key === 'selectors') {
      this.update(node.map(function(v) {
        if(ignore && v.startsWith(ignore)) {
          v = v.replace(ignore, '');
          return namespace + v;
        } else {
          return namespace + ' ' + v;
        }
      }));
    }
  });
  return stringify(parsed);
}