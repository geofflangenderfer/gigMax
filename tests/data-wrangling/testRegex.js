const assert = require('assert');

(() => (
  let id = '';
  let file = '';
  assert(isMatch(id, file) == true);
))();
function isMatch(littleSpoon, bigSpoon) {
  let regex = new RegExp(littleSpoon);
  let stringMatch = bigSpoon.match(regex)[0];
  return stringMatch != "";
}
