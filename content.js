function makeTabObject (types) {
  var keys = {};
  types.forEach(function(type) {
  	var tag = document.getElementsByName(type);
    keys[type] = tag[0]['content'];
  });
  
  return keys;
}
var searchTerms = makeTabObject(['author', 'keywords', 'description']);

chrome.runtime.sendMessage(searchTerms);