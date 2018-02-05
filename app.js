var localDB;
initializeFirebase();



/*
function writeNewPost(uid, username, title, body) {
  // A post entry.
  var postData = {
    author: username,
    uid: uid,
    body: body,
    title: title,
    starCount: 0,
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('posts').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/posts/' + newPostKey] = postData;
  updates['/user-posts/' + uid + '/' + newPostKey] = postData;

  return firebase.database().ref().update(updates);
}
*/

$('#reset').on('click', resetTimetable); //when "reset" button is clicked, reset Firebase to default
firebase.database().ref('trainLines').on('value', redrawTimetable); //when Firebase detects any changes, update the page
$('#submit-new-line').on('click', submitNewLine); //when the 'add' button in the modal is clicked, add a new line

function submitNewLine() {
  var newLine = {
    lineName: $('#input-line-name').val(),
    destination: $('#input-destination').val(),
    maidenVoyageDate: $('#maiden-voyage-date').val(),
    maidenVoyageTime: $('#maiden-voyage-time').val(),
    frequency: $('#frequency__hours').val() + 'h' + $('#frequency__minutes').val() + 'm'
  };
  console.log(newLine);
  firebase.database().ref('trainLines').push(newLine);
}

function parseLine() {
  var date = $('#maiden-voyage-date').val(); //get date from input in the format of 'yyyy-mm-dd'
  date = date.split('-'); //split the date into an array
  date[1] -= 1; //minus the month by 1, because months count from 0 to 11 in the js date object
  var time = $('#maiden-voyage-time').val(); //get time from input in the format of 'hh:mm' (24h)
  time = time.split(':'); //split the time into an array
  //[...date, ...time],
}

function resetTimetable() { //this function resets Firebase to default
  var defaultLines = [{
    lineName: "Southern Dream",
    destination: "Sydney",
    maidenVoyageDate: "1977-01-15",
    maidenVoyageTime: "08:00",
    frequency: "20m"
  }, {
    lineName: "Furikake",
    destination: "Tokyo",
    maidenVoyageDate: "1989-12-22",
    maidenVoyageTime: "15:30",
    frequency: "2h30m"
  }, {
    lineName: "Breakaway",
    destination: "Iceland",
    maidenVoyageDate: "2008-07-13",
    maidenVoyageTime: "14:00",
    frequency: "8h"
  }, {
    lineName: "Lightning Bolt",
    destination: "Jupiter",
    maidenVoyageDate: "2017-08-08",
    maidenVoyageTime: "07:07",
    frequency: "24h"
  }];

  firebase.database().ref('trainLines').set({}); //empty everything in firebase
  for (let i of defaultLines) {
    firebase.database().ref('trainLines').push(i);
  }
}

function redrawTimetable(snapshotFromFirebase) { //this function updates the timetable on the page using Firebase data, also updates the LocalDB
  localDB = snapshotFromFirebase.val();
  for (let i in localDB) {
    let newRow = $('<tr>');
    newRow.append(`<td>${localDB[i].lineName}</td>)`);
    newRow.append(`<td>${localDB[i].destination}</td>)`);
    newRow.append(`<td>${localDB[i].frequency}</td>)`);
    $('#timetable__body').append(newRow);
  }
}

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
  firebase.initializeApp(config);
}


