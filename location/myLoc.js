window.onload = getMyLocation;

var HQCoords = {
	latitude: 29.581721599999998,
	longitude: -98.4496721
};

var map;


function getMyLocation() {
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(displayLocation,displayError);
	}
	else {
		alert("Oops, no geolocation support");
	}
}

function displayLocation(position) {
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	
	var div = document.getElementById("location");
	div.innerHTML = "You are at Latitude: " + latitude + " , Longitude: " + longitude;
	
	var km = computeDistance(position.coords, HQCoords);
	var distance = document.getElementById("distance");
	if(km == 0)
		distance.innerHTML = "You are at the HQ";
	else
		distance.innerHTML = "You are " + km + " km from the HQ";
	
	showMap(position.coords);
}

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

function showMap(coords) {
	var googleLatAndLong = 
				new google.maps.LatLng(coords.latitude,
										coords.longitude);
										
	var mapOptions = {
		zoom: 10,
		center: googleLatAndLong
		//mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	
	var mapDiv = document.getElementById("map");
	map = new google.maps.Map(mapDiv, mapOptions);
}