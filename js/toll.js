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
	    // Locations returned in response are not ordered
	    var locations  = parseData(data);

		printTollList(locations);

		var firstSignInList = Object.keys(locations)[0];
		printSigns(locations[firstSignInList], firstSignInList);
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

	function printTollList(locations) {
		var container = document.getElementById("toll-list");
		var tollTemplate = '';
		for (var key in locations) {
			if (locations.hasOwnProperty(key)) {
					var obj = locations[key];

					tollTemplate += '<li class="toll-selector" data-name="'+obj[0].StartLocationName+'" data-id="'+ obj[0].StartMilepost +'" data-direction="'+obj[0].TravelDirection+'">\
										<div class="name">'+obj[0].StartLocationName+'</div>\
										<div class="direction">'+obj[0].TravelDirection+'</div>\
									</li>';
					/*...
					Checking and outpouting individual values during testing
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
					*/
					container.innerHTML = tollTemplate;
			}
		}
	}

	function printSigns(tolls, id){
		console.log(tolls);
		return false;
	}

  
});