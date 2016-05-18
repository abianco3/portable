function API (config) {
	
	/*for (var i in config) {
		if (config.hasOwnProperty(i)) {
			this[i] = config[i];
		}
	}*/
	this.baseURL = config.baseURL;

	this.api = config.api;

	this.authURL = config.authURL;

	this.clientID = config.clientID;

	this.clientSecret = config.clientSecret;

}



API.prototype.getToken = function (interactive, callback, scopes) {
	
	var scopes, redirectURI, url;

	redirectURI = chrome.identity.getRedirectURL(this.api);

	URL = this.authURL +
		  
		  "client_id=" +this.clientID+
		  "&redirect_uri=" +redirectURI+
		  "&response_type=token";
	
	if (scopes) {
		URL += "&scope=" + encodeURIComponent(scopes);
	}

	chrome.identity.launchWebAuthFlow({
		
		"url": URL, 
		
		"interactive": interactive
	
	},

	
	function(redirect_url) {
		
		var tokenString = redirect_url.match(/access_token=[\w-]+/i)[0];
    
    var token = tokenString.slice(tokenString.indexOf("=")+1);

    callback(token);
	
	});

};



API.prototype.xmlrequest = function (type, url, callback, headers) {
	
	var xhr = new XMLHttpRequest();
	
	xhr.open(type, url, true);
	
  if (headers) {
      
      for (var i in headers) {
        
        if (headers.hasOwnProperty(i)) {
          
          xhr.setRequestHeader(i, headers[i]);
      
      }
    
    }
  
  }
    
  xhr.responseType = "json";

  xhr.onreadystatechange = function () {
    
    if (xhr.readyState===4) {
      
      callback(xhr.response);
        
    }
  
  };

  xhr.send();

};




var spotify = new API ({
	
	baseURL : "https://api.spotify.com/", 
	api : "spotify",
	authURL : "https://accounts.spotify.com/authorize?",
	clientID : '646a5893424a4d3b8e14144938d97938'}) 

{
	
	this.user = spotify.getUserID;

};



spotify.getUserID = function () {

  var _this = this;

  console.log(_this);

  if (_this.userID) {
  	return function () {
  		return _this.userID;
  	};
  }


  _this.getToken(true, function (token) {

    var header, url;

    header = {"Authorization" : "Bearer" + " " + token};

    url = _this.baseURL + "v1/me";
   
    _this.xmlrequest("GET", url, function (userInfo) {

    	var ID = userInfo["id"];

    	_this.userID = ID;

    	return _this.userID;

      }, header
    );
   
  });

};

spotify.getSaved = function (type) {



  var _this = this;


  _this.getToken(true, function (token) {

    var header, url, endpoint;

    endpoint = "v1/me/" + type;

    header = {"Authorization" : "Bearer" + " " + token};

    url = _this.baseURL + endpoint;
   
    _this.xmlrequest("GET", url, function (songs) {

    	console.log(songs);

    	_this[type] = songs;

    	return _this[songs];

      }, header
    );
   
  });

};






spotify.getSong = function (keyword) {
  
  var _this, url, headers;

  console.log(this);

	_this = this;

	url = _this.baseURL + "v1/search?q=" + keyword + "&type=track&limit=1";

  headers = {
  	"accept" : "application/json",
  	"Content-Type" : "application/json"
  };

	_this.xmlrequest("GET", url, function (result) {

		var song, album, uri, images;

		song = result['tracks']['items'][0];

		uri = song.uri.slice(song.uri.lastIndexOf(":")+1);

		album = song.album;

		images = album.images;

		console.log(album);

		if (album && images) {
      
      imgURL = images[1]['url'];  
      songURI = "https://play.spotify.com/track/" + uri; 
    
    }

  },
  headers
  
  );

};

var rovi = new API ({
	baseURL : "https://api.rovicorp.com/", 
	api : "rovi",
	clientID : "5zxm9fzau75qjqve8g8fvv9j",
	clientSecret: "MA7hnptRBd"
});

rovi.search = function(keyword) {
	
	var _this, url, sig, headers;

	sig = md5(_this.clientID + _this.clientSecret + Math.floor(Date.now() / 1000));

	url = _this.baseURL + "search/v2.1/music/search?apikey=" 
											+ _this.baseURL 
											+ "&sig=" + sig 
											+ "&query=" + keyword 
											+ "&entitytype=song";

	headers = {
  	"accept" : "application/json",
  	"Content-Type" : "application/json"
  };

  _this.xmlrequest("GET", url, function (response) {
  	return response;
  }, headers);
};




