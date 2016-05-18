//receive message from popup

chrome.runtime.onMessage.addListener(function(request) {
	var terms = request.keywords.split(',');
	var i = function (max) {
		return Math.floor(Math.random() * max);
	}(terms.length);
	console.log(terms);
    console.log(terms[i]);
	  spotify.getSong(terms[i]);
});


var songURI = "https://play.spotify.com/track/01OXa5tVuCssU6j8TY7kxr"; 
var imgURL = "https://i.scdn.co/image/f3a6ffb8998d47a6757f6371975ddd4c7a5370a1";



/*function auth (scopesArr) {
    
    var client_id = '646a5893424a4d3b8e14144938d97938';
    var redirectUri = chrome.identity.getRedirectURL('spotify');
    var scopes = scopesArr.join('%20');
    console.log(scopes);

    chrome.identity.launchWebAuthFlow({
        "url": "https://accounts.spotify.com/authorize?client_id="+client_id+
         "&redirect_uri="+redirectUri+ 
         "&response_type=token"+
         "&scope="+scopes, 

        "interactive": true  
    },
    function(redirect_url) { 
      console.log(redirect_url);

      var tokenString = redirect_url.match(/access_token=[\w-]+/i)[0];
      var token = tokenString.slice(tokenString.indexOf("=")+1);
      var url = "https://api.spotify.com/v1/me";

      var xhr = new XMLHttpRequest;
      xhr.open("GET", url, true);
      xhr.responseType = "json";
      xhr.setRequestHeader("Authorization", "Bearer" + " " + token);
      xhr.onreadystatechange = function () {
        if (xhr.readyState===4){
            var user = xhr.response.id;
            console.log(user);
        }
      };
      xhr.send();
    });
    
    return user;
}



function initXML (type, url, sync, headers) {
	var xhr = new XMLHttpRequest();
	
	xhr.open(type, url, sync);
	
    if (headers) {
        for (var i in headers) {
          if (headers.hasOwnProperty(i)) {
            xhr.setRequestHeader(i, headers[i]);
        }
      }
    }
    

	return xhr;
}



function getSong (keyword) {
	
    var url = 'https://api.spotify.com/v1/search?q=' + keyword + '&type=track&limit=1';
    //make XMLHttprequest
    
    var xhr = initXML("GET", url, true);
    
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
          if (album && images) {
            imgURL =images[0]['url'];  
            songURI = "https://play.spotify.com/track/" + uri; 
          }
    	  }

    };

    xhr.send();

}

function getSong (keyword) {
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