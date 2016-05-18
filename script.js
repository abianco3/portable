document.addEventListener('DOMContentLoaded', function () {
    chrome.runtime.getBackgroundPage(function (eventPage) {
    	var link =document.createElement('a');
    	var image =document.createElement('img');
    	image.src = eventPage.imgURL;
    	link.href = eventPage.songURI;
    	var uri = link.href;
    	link.onclick = function () {
    		chrome.tabs.create({active: true, url: uri});

    	};
      link.appendChild(image);
      document.body.appendChild(link);
    });
});


