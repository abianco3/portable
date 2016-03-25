//receive message from popup
chrome.runtime.onMessage.addListener(function(request) {
	var terms = request.keywords.split(',');
	var i = function (max) {
		return Math.floor(Math.random() * max);
	}(terms.length);
	console.log(terms);
    console.log(terms[i]);
	getSong(terms[i]);
});




var songURI = "https://play.spotify.com/track/01OXa5tVuCssU6j8TY7kxr"; 
var imgURL = "https://i.scdn.co/image/f3a6ffb8998d47a6757f6371975ddd4c7a5370a1";



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
	var url = 'https://api.spotify.com/v1/search?q=' + keyword + '&type=track&limit=1';
    //make XMLHttprequest
    var xhr = initXML("GET", url, true, headers);
    var headers = {
    	'accept': 'application/json',
    	'Content-Type': 'application/json'
    };
    
    xhr.responseType = "json";
    xhr.onreadystatechange = function() {
    	if (xhr.readyState === 4) {
    		var result = xhr.response['tracks']['items'][0];
            var uri = result.uri.slice(result.uri.lastIndexOf(":")+1);
            var album = result.album;
            var images = album.images;
            imgURL =images[0]['url'];  
            songURI = "https://play.spotify.com/track/" + uri;
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

//getSong('abbas');