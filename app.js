initializeFirebase();


function initializeFirebase() {
  var apiKey1stHalf = 'AIzaSyCZskGEWNvuDsAq';
  var apiKey2ndHalf = 'VEX_4CSxVOpAuGho0zg';
  var config = {
    apiKey: apiKey1stHalf + apiKey2ndHalf,
    authDomain: "train-schedule-homework-99e78.firebaseapp.com",
    databaseURL: "https://train-schedule-homework-99e78.firebaseio.com",
    projectId: "train-schedule-homework-99e78",
    storageBucket: "train-schedule-homework-99e78.appspot.com",
    messagingSenderId: "924815602497"
  };
  console.log(config);
  firebase.initializeApp(config);
}
