document.addEventListener('DOMContentLoaded', function () {
    
    chrome.runtime.getBackgroundPage(function (eventPage) {
    	
        var link =document.createElement('a');
    	var image =document.createElement('img');
    	
        image.src = eventPage.imgURL;
    	link.href = eventPage.songURI;
    	
        var uri = link.href;
    	
        
        link.onclick = function () {
    		
            chrome.tabs.create({active: true, url: uri});
            chrome.runtime.sendMessage({content : 'token'});
            //call function that builds user object
    	};
      
      link.appendChild(image);
      document.body.appendChild(link);
    
    });
});


