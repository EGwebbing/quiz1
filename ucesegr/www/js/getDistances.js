// This script is based on the code provided by CEGEG077 Web&Mobile tutorials

// This function references another function to calculate the distances from the points of interest.
// It is used inside the index.html file to get new questions and calls the getDistanceFromPoint function to determine users proximity
function getDistance() {
	alert('Detecting distance');
	navigator.geolocation.getCurrentPosition(getDistanceFromPoint); 
}

// global variable for the POI
var pointlayer;
// global variables for questions and optional answers
var question;
var optionA;
var optionB;
var optionC;
var optionD;
var correct;

// The function calculates the distances from each point of interest selecting the nearest point that falls within the search radius,
// by indexing all the distance calculated, and extract the question related.
function getDistanceFromPoint(position) {
	// accessing to the geojson coordinates
	var myJson = pointlayer.toGeoJSON().features; // toGeoJSON method from https://leafletjs.com/reference-1.3.0.html
	var searchRadius = 0.1
	var minDist = [] // empty list that will be filled with the distances from each point of interest
	// The for loop calculate the distance of the user from each point of interest
	for (var i=0; i < myJson.length; i++){
		var lat = myJson[i].geometry.coordinates[1];
		var lng = myJson[i].geometry.coordinates[0];
		minDist [i] = calculateDistance(position.coords.latitude, position.coords.longitude, lat,lng);
		console.log(minDist[i]);
	}
	console.log(minDist);
	// The lowest distance is taken and its index is used to get the properties of the point
	var minimum = Math.min.apply(null, minDist);
	var minIndex = minDist.indexOf(minimum);
	console.log(minimum); // checking if the function is working well
	console.log(minIndex);
	var myQuestions = pointlayer.toGeoJSON().features[minIndex].properties; // accessing to the geojson properties 
	// getting the question and the answers stored in the GeoJSON
	question = myQuestions["question"];
	optionA = myQuestions["answ1"];
	optionB = myQuestions["answ2"];
	optionC = myQuestions["answ3"];
	optionD = myQuestions["answ4"];
	correct = myQuestions["correct_answer"];
	console.log(correct);
	// creating the radio button that are loaded once the user is near a point of interest
	document.getElementById('showQuestions').innerHTML = "Question: " + question;
	document.getElementById('showansw1').innerHTML = "Option A: " + optionA + '<input type="radio" name="answers" id="showansw1"/>';
	document.getElementById('showansw2').innerHTML = "Option B: " + optionB + '<input type="radio" name="answers" id="showansw2"/>';
	document.getElementById('showansw3').innerHTML = "Option C: " + optionC + '<input type="radio" name="answers" id="showansw3"/>';
	document.getElementById('showansw4').innerHTML = "Option D: " + optionD + '<input type="radio" name="answers" id="showansw4"/>';
	
	// If nearest point is within the search radius the user can play the game
	if (minimum <= searchRadius){
		alert("You're in proximity of a point of interest! Scroll down to see the question.");
	} else if (minimum > searchRadius) {
		alert("There are no points of interest near you")
	}
}

// Global variable which allows to acces the radio buttons
var htmlCollection = document.getElementsByName('answers');

// Function used during the Web&Mobile tutorials
// code adapted from https://www.htmlgoodies.com/beyond/javascript/calculate-the-distance-between-two-points-inyour-web-apps.html
function calculateDistance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180;
	var radlat2 = Math.PI * lat2/180;
	var radlon1 = Math.PI * lon1/180;
	var radlon2 = Math.PI * lon2/180;
	var theta = lon1-lon2;
	var radtheta = Math.PI * theta/180;
	var subAngle = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	subAngle = Math.acos(subAngle);
	subAngle = subAngle * 180/Math.PI; // convert the degree value returned by acos back to degrees from radians
	dist = (subAngle/360) * 2 * Math.PI * 3956; // ((subtended angle in degrees)/360) * 2 * pi * radius )
	// where radius of the earth is 3956 miles
	if (unit=="K") { dist = dist * 1.609344 ;} // convert miles to km
	if (unit=="N") { dist = dist * 0.8684 ;} // convert miles to nautical miles
	return dist;
}
	

// The function check the user answer and then upload the data to the database.
// The code is similar to the ne used to upload the data from WebApp.
function checkAnswer(){
	alert('Uploading answer to the server');
	htmlCollection[0].value = optionA;
	htmlCollection[1].value = optionB;
	htmlCollection[2].value = optionC;
	htmlCollection[3].value = optionD;
	var userAnswer;
	for (i=0; i<htmlCollection.length; i++){
		if (htmlCollection[i].checked == true){
			userAnswer = htmlCollection[i].value;
			if (htmlCollection[i].value == correct){
				alert('Correct, Well done!');
			} else {
				alert('Sorry but the right answer is ' + correct);
			}
		}
	}
	console.log(userAnswer);
	var postString = "userAnswer="+userAnswer+"&correct="+correct;
	console.log(postString);
	processDataAnswer(postString);
}
	
var client;
function processDataAnswer(postString) {
	client = new XMLHttpRequest();
	client.open('POST','http://developer.cege.ucl.ac.uk:30295/checkAnswer',true);
	client.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	client.onreadystatechange = dataUploadedAnswer;
	client.send(postString);
}

// create the code to wait for the response from the data server, and process the response once it is received
function dataUploadedAnswer() {
	//this function listens out for the server to say that the data is ready - i.e. has state 4
	if (client.readyState == 4) {
		// make an alert to show the response
		alert("Data uploaded correctly") +
		setTimeout(getDistance,20000);
		//document.getElementById("dataUploadResult").innerHTML = "Data uploaded correctly";
	}
}	

	
	
	
	
	
	
	