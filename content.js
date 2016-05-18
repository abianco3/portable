function makeTabObject (types) {
  var keys = {};
  types.forEach(function(type) {
  	var tag = document.getElementsByName(type);
  	console.log(tag);
    content = tag[0] ? tag[0]['content'] : null;
    if (content!=null) {
      keys[type] = content;
    }
  });

  var p = document.getElementsByTagName("p");

  console.log(p);

  return keys;

}
var searchTerms = makeTabObject(['author', 'keywords', 'description']);

console.log(searchTerms);

chrome.runtime.sendMessage(searchTerms);