var data;
document.addEventListener("DOMContentLoaded", function() {
	var url = 'https://cors-anywhere.herokuapp.com/https://wsdot.com/traffic/api/api/tolling?AccessCode=55456380-46f5-46d1-8fc4-cfe225f203d4';
	var tollCont = document.getElementById('toll-container');

	var request = new XMLHttpRequest();
	request.open('GET', url, true);

	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
	    // We retrieved the data successfully.
	    data = JSON.parse(request.responseText);
	    var locations  = parseData(data);
			console.log(locations);
			printSigns(locations);

	  } else {
	    // We reached our target server, but it returned an error.

	  }
	};

	request.onerror = function() {
	  // There was a connection error of some sort.
	};

	request.send();

	function parseData(data) {
		var keys = {};
		for (var i = 0; i < data.length; i++) {
			if (keys[data[i].StartMilepost] == null) {
				keys[data[i].StartMilepost] = [];
			}
			keys[data[i].StartMilepost].push(data[i]);
		}
		return keys;
	}

	function printSigns(locations) {
		var container = document.getElementById("toll-container");
		for (var key in locations) {
			if (locations.hasOwnProperty(key)) {
					var obj = locations[key];
					var address = document.createElement("h3");
					address.innerText = obj[0].StartLocationName + " - " + obj[0].TravelDirection + " (identifier: " + obj[0].StartMilepost + ")";
					container.appendChild(address);
					for (var i = 0; i < obj.length; i++) {
						var endingLocation = document.createElement("span");
						endingLocation.innerText = obj[i].EndLocationName;

						var currentMessage = document.createElement("li");
						currentMessage.innerText = obj[i].CurrentMessage;

						var currentToll = document.createElement("li");
						currentToll.innerText = "Current Toll: " + obj[i].CurrentToll;

						container.appendChild(endingLocation);
						container.appendChild(currentMessage);
						container.appendChild(currentToll);
					}
					var breakline = document.createElement("br");
					container.appendChild(breakline);
			}
		}
	}



  
});