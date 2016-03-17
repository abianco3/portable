//receive message from popup
chrome.runtime.onMessage.addListener(function(request) {
	var terms = request.keywords.split(',');
	var i = function (max) {
		return Math.floor(Math.random() * max);
	}(terms.length);
	console.log(terms[i]);
	//getSong(terms[i]);
});


var songURI; 
var oAuth;



function initXML (type, url, sync, headers) {
	var xhr = new XMLHttpRequest();
	
	xhr.open(type, url, sync);
	
	for (var i in headers) {
		if (headers.hasOwnProperty(i)) {
			xhr.setRequestHeader(i, headers[i]);
		}
	}

	return xhr;
}

function getSong (keyword) {
	var url = 'https://api.spotify.com/v1/search?q=' + keyword + '&type=album&limit=1';
    //make XMLHttprequest
    var xhr = initXML("GET", url, true, headers);
    var headers = {
    	'accept': 'application/json',
    	'Content-Type': 'application/json'
    };
    
    xhr.responseType = "json";
    xhr.onreadystatechange = function() {
    	if (xhr.readyState === 4) {
    		songURI = "https://embed.spotify.com/?uri=" + xhr.response['albums']['items'][0]['uri'];
    	}
    };
    xhr.send();

}

/*function getSong (keyword) {
	var url = 'https://api.spotify.com/v1/search?q=' + keyword + '&type=album&limit=1';
    //make XMLHttprequest
    var xhr = new XMLHttpRequest();
    var headers = {
    	'accept': 'application/json',
    	'Content-Type': 'application/json'
    };
    xhr.open("GET", url, true);
    for (var i in headers) {
    	if (headers.hasOwnProperty(i)) {
    	xhr.setRequestHeader(i, headers[i]);
      }
    }
    xhr.responseType = "json";
    xhr.onreadystatechange = function() {
    	if (xhr.readyState === 4) {
    		//console.log(xhr.response);
    		songURI = "https://embed.spotify.com/?uri=" + xhr.response['albums']['items'][0]['uri'];
    		
    	}
    };
    xhr.send();
}*/

getSong('abbas');