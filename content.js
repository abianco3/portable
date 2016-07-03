function keyword () {

  var uri, xhr, url, count, data;

  uri = window.location.href;

  xhr = new XMLHttpRequest();

  url = 'http://gateway-a.watsonplatform.net/calls/url/URLGetRankedKeywords';

  count = 0;

  data = {

    url : uri,

    apikey : '0cc036f94105c0c5d39c36790a77146ab27ca3a1',

    outputMode : 'json'

  };

  count = 0;

  url += '?';

  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      if (count > 0) {
        url += '&';
      }
      url += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
      count++;
    }
  }

  xhr.open("GET", url);

  xhr.onload = function () {
          
    if (xhr.status >= 200 && xhr.status <= 300) {
  
      chrome.runtime.sendMessage(xhr.response);
      
    }

    else {
        
      console.log(xhr.response);
    
    }
      
  };


  xhr.onerror = function () {
  
    console.log(xhr.response);

  };

  xhr.send();

}

keyword();

chrome.runtime.onMessage.addListener(

  function(message) {

    if (message.content==='reload') {

      keyword();
    
    }
  
  }

);
