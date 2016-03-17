window.onload = function () { 
    chrome.runtime.getBackgroundPage(function (eventPage) {
  	  var uri = eventPage.songURI;
  	  var iframe = document.createElement("iframe");
  	  iframe.src= uri;
  	  iframe.width="300"; iframe.height="380"; iframe.frameborder="0"; iframe.allowtransparency="true";
  	  document.body.appendChild(iframe);
  	});
 };




//61dByu8oBt4qdym9Rkz39w
