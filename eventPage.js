//receive message from popup

/*chrome.runtime.onMessage.addListener(function(request) {
	
  var terms = request.keywords.split(',');
	
  var i = function (max) {
		return Math.floor(Math.random() * max);
	}(terms.length);
	
  console.log(terms);
  console.log(terms[i]);
	
 var song = spotify.song(terms[i]);

 console.log(song); 

 song.then(function (result) {

  var track, album, uri, images;


    track = result["tracks"]["items"][0];

    uri = track.uri.slice(track.uri.lastIndexOf(":")+1);

    album = track.album;

    images = album.images;

    console.log(album);

    if (album && images) {
      
      imgURL = images[1]['url'];  
      songURI = "https://play.spotify.com/track/" + uri; 
    
    }
 }, function (reason) {
  console.log(reason);
 });
 

});
*/

chrome.runtime.onMessage.addListener(
  function(message) {

    if (message.content == 'token') {

      spotify.token(true).then(function(result) {
        
        chrome.tabs.query({active : true}, function(tabs) {

          chrome.tabs.sendMessage(tabs[0].id, {content: 'reload'});

        });

      });

    }
    
    else {

      var songs, keys, user, ranked;

      songs = [];

      keys = JSON.parse(message).keywords;


      
      user = spotify.token(false)
      .then(function(token) {

        return spotify.makeUser(token);
      
      });

      for (var i = 0; i<keys.length; i++) {

        songs.push(spotify.song(keys[i].text));

      }

      ranked = user.then(function(user) {
        return Promise.all(user)
        .then(function (user) {
          var info = {
            tracks : user[0],
            albums : user[1],
            id : user[2]
          };

          console.log(info.albums);
          console.log(info.tracks);

          return Promise.all(songs)
          .then(function(songs) {
            console.log(songs);
            var mapped = songs.map(function(song) {
              console.log(song);
              if (song !== undefined && song.tracks.items.length>0) {
                console.log(song.tracks.items[0].id);
                console.log(song.tracks.items[0].album.id);
                var obj = {};
                obj.song = song;
                obj.points = 0;
                var tracks = info.tracks.items;
                var albums = info.albums.items;
                for (var i=0; i<tracks.length; i++) {
                  console.log(tracks[i].track.id);
                  if (tracks[i].track.id === song.tracks.items[0].id) {
                    obj.points++;
                  }
                }
                for (var j=0; j<albums.length; j++) {
                  console.log(albums[j]);
                  if (albums[j].album.id === song.tracks.items[0].album.id) {
                    obj.points++;
                  }
                }
                return obj;
              }
            }).filter(function(item) {
              return item !== undefined;
            });
            return mapped;
          });

        });
      })
      .catch(function(error) {
        console.log(error);
        return error;
      });

      console.log(ranked);

      ranked.then(function(result) {
        console.log(result);
      });



      






      /*var user = spotify.makeUser();

      console.log(user);

      var len = Object.keys(songs).length;

      var j = function j () {
        return function (max) {
          return Math.floor(Math.random() * max);
        }(len);
      };

  
      
  
      song = spotify.song(keywords[i()].text);

      while (!song) {
        song = spotify.song(keywords[i()].text);
      }

      console.log(song); 

      song.then(function (result) {

        var track, album, uri, images;

        console.log(result);
    
        track = result.tracks.items[0];

        console.log(track);

        uri = track.uri.slice(track.uri.lastIndexOf(":")+1);

        album = track.album;

        images = album.images;

        console.log(album);

        if (album && images) {
      
          imgURL = images[1].url;  
          songURI = "https://play.spotify.com/track/" + uri; 
    
        }
      }, function (reason) {
           console.log(reason);
         }
      )
      .catch(function (reason) {
                console.log(reason);
              }
      );*/

    }
  
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