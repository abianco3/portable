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

	this.apiKey = config.apiKey;

}



API.prototype.getToken = function (interactive, url, data) {
	
	var promise = new Promise ( function (resolve, reject) {

		var uri;


	  uri = url;
		      

	  if (data) {
  			
  		var count = 0;

  		uri += '?';

  		for (var key in data) {
				if (data.hasOwnProperty(key)) {
				  if (count > 0) {
				  	uri += '&';
				  }
				uri += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
				count++;
				}
		  }
	  }

	  console.log(uri);

	  chrome.identity.launchWebAuthFlow({
		
		  "url": uri, 
		
		  "interactive": interactive
	
	  },

	
	  function(redirect_url) {

      if (redirect_url) {
      	resolve(redirect_url);
      }

      else {
      	reject(redirect_url);
      }
	
	  });

	});

return promise;	

};





API.prototype.http = function (url) {
  
  var xml = function(method, url, params) {

  	var promise = new Promise ( function (resolve, reject) {

  		var uri = url;
		
		var xhr = new XMLHttpRequest();


  		if (params.data && method === 'GET') {
  			
  			var count = 0;

  			var data = params.data;

  			uri += '?';

  			for (var key in data) {
				if (data.hasOwnProperty(key)) {
				  if (count > 0) {
				  	uri += '&';
				  }
				uri += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
				count++;
				}
			}
		}

		xhr.open(method, uri);

		if (params.headers) {

		  var headers = params.headers;

		  for (key in headers) {
			if(headers.hasOwnProperty(key)) {
			  xhr.setRequestHeader(key, headers[key]);
			}
		  }
		}



		xhr.onload = function () {
				  
			if (xhr.status >= 200 && xhr.status <= 300) {
				resolve(xhr.response);
			}

			else {
			  reject(xhr.response);
			}
		  
		};


		xhr.onerror = function () {
		  reject(xhr.response);
		};

		  

		if (method === 'PUT' || method === 'POST') {
		  xhr.send(params.data);
		}

		else {
		  xhr.send();
		}

		
		});

  	
  	return promise;

  
  };

  return {
  	
  	'get' : function (data) {
  		return xml('GET', url, data);
  	},

  	'post' : function (data) {
  		return xml('POST', url, data);
  	},

  	'put' : function (data) {
  		return xml ('PUT', url, data);
  	},
   
    'delete' : function (data) {
    	return xml ('DELETE', url, data);
    }

  };

};


var spotify = new API ({
	
	baseURL : "https://api.spotify.com/", 
	api : "spotify",
	authURL : "https://accounts.spotify.com/authorize",
	clientID : '646a5893424a4d3b8e14144938d97938'});


spotify.userID = function userID (token) {

  
  var header, url, params;

  
  header = {"Authorization" : "Bearer" + " " + token};

  url = this.baseURL + "v1/me";
   
  params = {headers : header};

  
  handler = {

  	success : function(response) {
  		return JSON.parse(response).id;
  	},

  	error : function(reason) {
  		console.log(reason);
  	}
  };

	
	return this.http(url)
	  .get(params)
	  .then(handler.success, handler.error)
	  .catch(handler.error);

};



spotify.saved = function saved (token, type) {
 

  var header, url, params, data;

  
  header = {"Authorization" : "Bearer" + " " + token};

  url = this.baseURL + "v1/me/" + type;

  data = {limit: 50};
   
  params = {
  	headers : header,
  	data: data
  };


  
  handler = {

  	success : function(response) {
  		return JSON.parse(response);
  	},

  	error : function(reason) {
  		console.log(reason);
  	}
  };

	
  return this.http(url)
	.get(params)
	.then(handler.success, handler.error)
	.catch(handler.error);

};

spotify.token = function token (interactive) {

  
  var url, queries, handler, redirectURI, params, _this;

  _this = this;

  url = this.authURL;

  redirectURI = chrome.identity.getRedirectURL(this.api);

  
  queries = {

  	client_id : _this.clientID,
  	redirect_uri : redirectURI,
  	response_type : "token",
  	scope : "playlist-read-private user-library-read"
  
  };


  
  handler = {

  	success : function (redirect_url) {
  		var tokenString = redirect_url.match(/access_token=[\w-]+/i)[0];
      var token = tokenString.slice(tokenString.indexOf("=")+1);
      console.log(token);
      return token;
  	},

  	error : function (error) {
  		console.log(error);
  	}
  };

  
  return _this.getToken(interactive, url, queries)
  	.then(handler.success)
  	.catch(handler.error);


};



spotify.song = function song (keyword) {

	console.log(keyword);

	var _this, uri, queries, handler, params;

	_this = this;

	uri = _this.baseURL + 'v1/search';

	queries = {
		
		q : keyword,

		type : 'track',

		limit : '1'

	};

  params = {data : queries};

  handler = {

  	success : function(response) {
  		return JSON.parse(response);
  	},

  	error : function(reason) {
  		console.log(reason);
  	}
  };

	return _this.http(uri)
	  .get(params)
	  .then(handler.success, handler.error);
};


spotify.makeUser = function makeUser (token) {

  var user = [

    spotify.saved(token, "tracks"),

	spotify.saved(token, "albums"),

	spotify.userID(token)

  ];

  return user;

};


var rovi = new API ({
	
	baseURL : "https://api.rovicorp.com/", 
	api : "rovi",
	clientID : "5zxm9fzau75qjqve8g8fvv9j",
	clientSecret: "MA7hnptRBd"

});


rovi.search = function search (keyword) {
	
	var _this, url, sig, headers;

	sig = md5(_this.clientID + _this.clientSecret + Math.floor(Date.now() / 1000));

	url = _this.baseURL + "search/v2.1/music/search?apikey=" 
						+ _this.clientID 
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

var alchemy = new API ({
	
	baseURL : 'http://gateway-a.watsonplatform.net/',
	api : 'alchemy',
	apiKey : '0cc036f94105c0c5d39c36790a77146ab27ca3a1'

});


alchemy.keywords = function keywords (url) {

	
	var uri, params, queries, handler;

	
	uri = this.baseURL + 'calls/url/URLGetRankedKeywords';

	
	queries = {

		url : url,

		apikey : this.apiKey,

		outputMode : 'json'

	};

	
	params = {data : queries};


	handler = {
		
		success : function(response) {
			return JSON.parse(response);
		},

		error : function(reason) {
			console.log(reason);
		}

	};

  return http(uri)
         .get(params)
         .then(handler.success, handler.error)
         .catch(handler.error);

};

