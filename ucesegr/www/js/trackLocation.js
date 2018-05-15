// The script is based on the tutorials' code

// Create a global variable for the marker, so when the app udates the position it deletes the previous marker
var oldMarker;

// Activate the tracking by using ths function
function trackLocation(){
	// If the browser supports the geolocation the user will receive the alert "tracking enabled"
	if(navigator.geolocation){
		alert("tracking enabled");
		navigator.geolocation.watchPosition(showPosition);
		navigator.geolocation.getCurrentPosition(getDistance); // when the tracking is enabled it automatically get the distance from the points of interest
	} else {
		document.getElementById('showLocation').innerHTML = "Geolocation is not supported by this browser.";
	}
}

// The function allows to display the user's position on the map
function showPosition(position){
	if (oldMarker){
		mymap.removeLayer(oldMarker); // the method remove the previous markers
	}
	document.getElementById('showLocation').innerHTML = " Your coordinates - Latitude: " + position.coords.latitude + " Longitude: " + position.coords.longitude;
	oldMarker = L.circleMarker([position.coords.latitude,position.coords.longitude], {radius: 5}).addTo(mymap).bindPopup("current location").openPopup();
	mymap.setView([position.coords.latitude, position.coords.longitude], 25); // a new marker is placed on the map, on the current location
}