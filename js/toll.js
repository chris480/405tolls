var data;
document.addEventListener("DOMContentLoaded", function() {
	var url = 'https://cors-anywhere.herokuapp.com/https://wsdot.com/traffic/api/api/tolling?AccessCode=55456380-46f5-46d1-8fc4-cfe225f203d4';
	var tollCont = document.getElementById('toll-container');

	//Check localstorage and if previous call was greater than 15mins
	if(localStorage.getItem('tolls') == null || expired()){
		var request = new XMLHttpRequest();
		request.open('GET', url, true);

		request.onload = function() {
		  if (request.status >= 200 && request.status < 400) {
		    // We retrieved the data successfully.
		    data = JSON.parse(request.responseText);
		    // Locations returned in response are not ordered
		    initTolls(data);


			var dataJSON = data;
			localStorage.setItem('tolls', JSON.stringify(dataJSON));
			var time = {timestamp: new Date().getTime()}
			localStorage.setItem("time", JSON.stringify(time));

		  } else {
		    // We reached our target server, but it returned an error.

		  }
		};

		request.onerror = function() {
		  // There was a connection error of some sort.
		};

		request.send();
	}else{
		data = JSON.parse(localStorage.getItem('tolls'));
		initTolls(data);

		//Force activate previously selected element from history
		var clicked = JSON.parse(localStorage.getItem('clicked')).id;
		document.querySelectorAll('[data-id="'+clicked+'"]')[0].click();
	}

	function expired() {
		var time = JSON.parse(localStorage.getItem("time"));
		if (time == null) {
			return true;
		}
		var dateString = time.timestamp,
		    now = new Date().getTime().toString();		
		
		if (((now - dateString)/3600) >= 900) {
			return true;
		}
		return false
	}	

	function initTolls(data){

	    var locations  = parseData(data);
		printTollList(locations);

		var tollSelector = document.getElementsByClassName('toll-selector');
		for(var i=0; i<tollSelector.length; i++){
			tollSelector[i].addEventListener("click", tollOnClick, false);
		}		

	}

	/*Organize data more cleanly*/
	function parseData(data) {
		var keys = {};
		//Create objects based on keys of starting mile posts.
		//Each key can contain multiple items which are the individual tolls
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
					var tempTolls = '';
					//Store a data attr of toll prices inside li element
					for (var i = obj.length - 1; i >= 0; i--) {
						tempTolls += obj[i].CurrentMessage + ',' + obj[i].CurrentToll + ',' + obj[i].EndLocationName + ';';
					}

					tollTemplate += '<li class="toll-selector" data-name="'+obj[0].StartLocationName+'" data-id="'+ obj[0].StartMilepost +'" data-direction="'+obj[0].TravelDirection+'" data-tolls="'+tempTolls+'">\
										<div class="name">'+obj[0].StartLocationName+'</div>\
										<div class="direction">'+obj[0].TravelDirection+'</div>\
									</li>';

			}
		}
		container.innerHTML = tollTemplate;
	}

	function printSigns(toll, index, tollCount){
		if (index <= tollCount) {
			toll = toll.split(',');
			var tollSign = document.getElementsByClassName('toll-container')[0].children[index];
			tollSign.children[0].innerText = toll[2];
			tollSign.classList.remove('hidden');
			//toll[1] is price, toll[0] is messege
			if (toll[0] != "null") {
				tollSign.children[1].innerText = toll[0];
			} else{
				tollSign.children[1].innerText = "$" + (toll[1]/100).toFixed(2);
			}
		}else{
			var tollSign = document.getElementsByClassName('toll-container')[0].children[index-1];
			//Hides unused tolls
			tollSign.classList.add('hidden');
		}

	}

	function tollOnClick(){
		var el = this;
		//console.log(this);

		//Add active class to clicked li element
		var clicked = document.getElementsByClassName("clicked");
		while (clicked.length)
		    clicked[0].classList.remove("clicked");
		this.classList.add('clicked');
		
		var tolls = el.dataset.tolls.split(';');
		var tollCount = tolls.length - 2;

		for (var i = 4; i >= 0; i--) {
			printSigns(tolls[i], i, tollCount);
		};

		var saveClicked = {id: el.dataset.id};
		localStorage.setItem("clicked", JSON.stringify(saveClicked));		
	}

});