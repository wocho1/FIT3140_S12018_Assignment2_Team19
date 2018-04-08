var admin = require("firebase-admin");

// Fetch the service account key JSON file contents
var serviceAccount = require("./serviceAccountKey.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://myproject-4fd8b.firebaseio.com"  // IMPORTANT: repalce the url with yours 
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();
var ref = db.ref("/motionSensorData"); // channel name
ref.on("value", function(snapshot) {   //this callback will be invoked with each new object
  console.log(snapshot.val());         // How to retrive the new added object
}, function (errorObject) {             // if error
  console.log("The read failed: " + errorObject.code);
});

// MotionSensor
var bone = require('bonescript');
var led = 'USR3';	//Change to the correct pins
var sensor = 'P9_12';  //change to the correct pins

var shortM = 0;
var longM = 0;
var receiver = [];
var Npattern = 0;
var duration = 0;

bone.pinMode(led,bone.OUTPUT);
bone.pinMode(sensor, bone.INPUT);

testLed();  //Test LED Light
setInterval(checkSensor, 2000);

function testLed(){
	for (i=0; i<301; i++){
		bone.digitalWrite(led,1);
	}
}
// Starting to push


function checkSensor(){
	var input = bone.digitalRead(sensor);
	if(input == 1){
		bone.digitalWrite(led,1);
		console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
		console.log('Motion Detected');
		duration++;
	}
	else{
		console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
		console.log('No Motion Detected');
		bone.digitalWrite(led,0);
		if(duration <= 3 && duration > 0){
			shortM++;
			receiver.push('S');
			// Push data into Firebase
			ref.push({
			short_messages: shortM,
			long_messages: longM,
			visitors: Npattern
			});
			duration = 0;
		}
		if(duration > 3 && duration > 0){
			longM++;
			receiver.push('L');
			// Push data into Firebase
			ref.push({
			short_messages: shortM,
			long_messages: longM,
			visitors: Npattern
			});

			duration = 0;
		}
	}
	console.log('------------------------------');
	console.log('Short Motion: ' + shortM);
	console.log('Long Motion: ' + longM);
	console.log('List: ' + receiver);

	for(i = 0; i <= receiver.length;i++){
		if(receiver[i] === 'L'){
			if(receiver[i+1] === 'S'){
				if(receiver[i+2] === 'L'){
					if(receiver[i+3] === 'L'){
						Npattern++;
						// Push data into Firebase
						ref.push({
						short_messages: shortM,
						long_messages: longM,
						visitors: Npattern
						});

						receiver=[];
					}
				}
			}
		}
	}
	console.log('No Pattern: ' + Npattern);
}

