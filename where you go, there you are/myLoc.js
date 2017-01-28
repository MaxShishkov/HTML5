window.onload = getMyLocation;

var HQCoords = {
	latitude: 47.62485,
	longitude: -122.52099
};

var map;
var watchId = null;


function getMyLocation() {
	if(navigator.geolocation){
		var watchButton = document.getElementById("watch");
		watchButton.onclick = watchLocation;
		
		var clearWatchButton = document.getElementById("ClearWatch");
		clearWatchButton.onclick = clearWatch;
	}
	else {
		alert("Oops, no geolocation support");
	}
}

function watchLocation() {
	var options = {
		enableHighAccuracy: true, maximumAge: 60000
	};
	watchId = navigator.geolocation.watchPosition(displayLocation, displayError, options);
}

function clearWatch() {
	if(watchId) {
		navigator.geolocation.clearWatch(watchId);
		watchId = null;
	}
}

var prevCoords = null;

function displayLocation(position) {
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	
	var div = document.getElementById("location");
	div.innerHTML = "You are at Latitude: " + latitude + " , Longitude: " + longitude;
	div.innerHTML += " ( with " + position.coords.accuracy + " meters accuracy)";
	
	var km = computeDistance(position.coords, HQCoords);
	var distance = document.getElementById("distance");
	if(Math.floor(km) == 0)
		distance.innerHTML = "You are at the HQ";
	else
		distance.innerHTML = "You are " + km + " km from the HQ";
	
	if(map == null) {
		showMap(position.coords);
		prevCoords = position.coords;
	}
	else{
		var meters = computeDistance(position.coords, prevCoords) * 1000;
		if(meters > 20){
			scrollMapToPosition(position.coords);
			prevCoords = position.coords;
		}
	}
}


function showMap(coords) {
	var googleLatAndLong = 
				new google.maps.LatLng(coords.latitude,
										coords.longitude);
										
	var mapOptions = {
		zoom: 10,
		center: googleLatAndLong
	};
	
	var mapDiv = document.getElementById("map");
	map = new google.maps.Map(mapDiv, mapOptions);
	
	var title = "Your Location";
	var content = "You are here : " + coords.latitude + " , " + coords.longitude;
	addMarker(map,googleLatAndLong, title, content);
}

function scrollMapToPosition(coords) {
	var latitude = coords.latitude;
	var longitude = coords.longitude;
	var latlong = new google.maps.LatLng(latitude,longitude);
	
	map.panTo(latlong);
	
	addMarker(map, latlong, "Your new location", "You moved to: " +
								latitude + " " + longitude);
}

function addMarker(map, latlong, title, content) {
	var markerOptions = {
		position: latlong,
		map: map,
		title: title,
		clickable: true
	};
	
	var marker = new google.maps.Marker(markerOptions);
	
	var infoWindowOptions = {
		content: content,
		position: latlong
	};
	
	var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
	
	google.maps.event.addListener(marker, 'click', function() {
		infoWindow.open(map,marker);
	});
}



//===============helper functions===============//
function displayError(error) {
	var errorTypes = {
		0: "Unknown error",
		1: "Permission denied by user",
		2: "Position is not available",
		3: "Request timed out"
	};
	
	var errorMessage = errorTypes[error.code];
	if (error.code == 0 || error.code == 2) {
		errorMessage = errorMessage + " " + errorMessage;
	}
	
	var div = document.getElementById("location");
	div.innerHTML = errorMessage;
}

function computeDistance(startCoords, destCoords){
	var startLatRads = degreeToRadians(startCoords.latitude);
	var startLongRads = degreeToRadians(startCoords.longitude);
	var destLatRads = degreeToRadians(destCoords.latitude);
	var destLongRads = degreeToRadians(destCoords.longitude);
	
	var Radius = 6371  //radius of the Earth in km.
	
	var distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads ) + 
					Math.cos(startLatRads) * Math.cos(destLatRads) *
					Math.cos(startLongRads - destLongRads)) * Radius;

	return distance;
}

function degreeToRadians(degree) {
	var radius = (degree * Math.PI)/180;
	return radius;
	
}