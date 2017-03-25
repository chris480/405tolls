var data;
document.addEventListener("DOMContentLoaded", function() {
	var url = 'https://cors-anywhere.herokuapp.com/https://wsdot.com/traffic/api/api/tolling?AccessCode=55456380-46f5-46d1-8fc4-cfe225f203d4';
	var tollCont = document.getElementById('toll-container');

	var request = new XMLHttpRequest();
	request.open('GET', url, true);

	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
	    // Success!
	    data = JSON.parse(request.responseText);
	    var locations  = parseData(data);


	    tollCont.innerHTML = locations;
	  } else {
	    // We reached our target server, but it returned an error

	  }
	};

	request.onerror = function() {
	  // There was a connection error of some sort
	};

	request.send();

	function parseData(data){
		var keys = {};
		for(var i = 0; i < data.length; i++) 
			keys.push(data[i].StartLocationName);
		return keys;
	}

  
});