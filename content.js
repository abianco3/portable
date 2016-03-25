function makeTabObject (types) {
  var keys = {};
  types.forEach(function(type) {
  	var tag = document.getElementsByName(type);
  	console.log(tag);
    keys[type] = tag[0]['content'];
  });
  console.log(keys);

  return keys;
}
var searchTerms = makeTabObject(['author', 'keywords', 'description']);

console.log(searchTerms);

chrome.runtime.sendMessage(searchTerms);