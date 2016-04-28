import css from 'css';
import traverse from 'traverse';

export default function(content, namespace, ignore) {
  var parsed = css.parse(content);
  traverse.forEach(parsed, function(node) {
    if (this.key === 'selectors') {
      this.update(node.map(function(v) {
        if (ignore && v.startsWith(ignore)) {
          v = v.replace(ignore, '');
          return namespace + v;
        } else {
          return namespace + ' ' + v;
        }
      }));
    }
  });
  return css.stringify(parsed);
}