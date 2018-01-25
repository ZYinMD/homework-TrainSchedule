initializeFirebase();
var defaultLines = [{
  lineName: "Southern Dream",
  destination: "Sydney",
  maidenVoyage: "1977-01-15-08:00",
  frequency: "20m"
}, {
  lineName: "Furikake",
  destination: "Tokyo",
  maidenVoyage: "1989-12-22-15:30",
  frequency: "2h30m"
}, {
  lineName: "Breakaway",
  destination: "Iceland",
  maidenVoyage: "2008-07-13-14:00",
  frequency: "8h"
}, {
  lineName: "Lightning Bolt",
  destination: "Jupiter",
  maidenVoyage: "2017-08-08-7:07",
  frequency: "24h"
}];
a = "1437";
// console.log(moment(a, 'm').format("dddd, MMMM Do YYYY, h:mm:ss a"));
var database = firebase.database().ref('trainLines');
$('#reset').on('click', resetTimetable);
database.on('value', redrawTimetable);

function redrawTimetable(snapshotFromFirebase) {
  for (let i of snapshotFromFirebase.val()) {
    let newRow = $('<tr>');
    newRow.append(`<td>${i.lineName}</td>)`);
    newRow.append(`<td>${i.destination}</td>)`);
    newRow.append(`<td>${i.frequency}</td>)`);
    $('#timetable__body').append(newRow);
  }
}

function resetTimetable() {
  database.set(defaultLines);
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
