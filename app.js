var localDB;
initializeFirebase();
$('#reset').on('click', resetFirebase); //when "reset" button is clicked, reset Firebase to default
firebase.database().ref('trainLines').on('value', updateData); //when Firebase detects any changes, update the local database
$('#submit-new-line').on('click', submitNewLine); //when the 'add' button in the modal is clicked, add a new train line into Firebase
function submitNewLine() { //this function gets value from the modal and add a push train line into Firebase
  var newLine = {
    lineName: $('#input-line-name').val(),
    destination: $('#input-destination').val(),
    maidenVoyageDate: $('#maiden-voyage-date').val(),
    maidenVoyageTime: $('#maiden-voyage-time').val(),
    frequency: $('#frequency__hours').val() + 'h' + $('#frequency__minutes').val() + 'm'
  };
  firebase.database().ref('trainLines').push(newLine);
}

function updateData(snapshotFromFirebase) { //this function is triggered on Firebase change. It updates the LocalDB, as well as the display
  localDB = snapshotFromFirebase.val();
  setInterval(refreshTimeTable, 1000); //update the display every second with local data
  refreshTimeTable(); //manually call it once first, because the setInterval doesn't fire immediately
}

function refreshTimeTable() { //this function takes data from LocalDB and refresh the timetable on display
  $('#timetable__body').empty(); //clear current display and redraw the whole thing. It's not as fast as only updating the cells that need update, but it's easier to write
  for (let i in localDB) { //each i is a train line
    let newRow = $('<tr>'); //create a new row in the table, and start appending cells
    newRow.append(`<td>${localDB[i].lineName}</td>)`);
    newRow.append(`<td>${localDB[i].destination}</td>)`);
    newRow.append(`<td>${localDB[i].frequency}</td>)`);
    //construct a js date object containing the start time of the first train
    let maidenDate = localDB[i].maidenVoyageDate.split('-');
    maidenDate[1] -= 1; //minus the month by 1, because months count from 0 to 11 in the js date object
    let maidenTime = localDB[i].maidenVoyageTime.split(':');
    let maidenVoyage = new Date(...maidenDate, ...maidenTime);
    //compare the maidenVoyage with now
    let now = new Date();
    // the following big chunk of code is to calculate two key values: nextTrian (a js date object), and timeAway (integer of milliseconds)
    let nextTrain, timeAway, interval, intervalH, intervalM
    if (now < maidenVoyage) { //if maiden voyage is after now, just calculate how soon
      timeAway = maidenVoyage - now;
      nextTrain = maidenVoyage;
    } else { //if maiden voyage is before now, we're currently in between two trains
      interval = localDB[i].frequency;
      if (interval.includes('h')) { //if over an hour
        intervalH = interval.slice(0, interval.indexOf('h'));
        intervalM = interval.slice(interval.indexOf('h') + 1, -1);
        interval = intervalH * 60 * 60 * 1000 + intervalM * 60 * 1000;
      } else { //if less than an hour
        intervalM = interval.slice(0, -1);
        interval = intervalM * 60 * 1000;
      }
      timeAway = interval - (now - maidenVoyage) % interval;
      nextTrain = new Date(now - -timeAway); //intention was now + timeAway, but + creates concatenation, so have to use a workaround
    }
    timeAway = moment.duration(timeAway);
    nextTrain = moment(nextTrain);
    if (timeAway > 60 * 60 * 24 * 1000) { //if timeAway > 1 day
      timeAway = timeAway.humanize();
      if (nextTrain.year() == now.getFullYear()) { //if next train is in this year
        nextTrain = nextTrain.format('MMM D h:mma');
      } else { //if next train is not in this year
        nextTrain = nextTrain.format('MMM D YYYY h:mma');
      }
    } else { //if timeAway < 1 day
      if (timeAway.hours()) { //if hour > 0
        timeAway = `${timeAway.hours()}:${String(timeAway.minutes()).padStart(2, '0')}:${String(timeAway.seconds()).padStart(2, '0')}` //sometimes minutes and seconds are in single digit when < 10, pad it
      } else if (timeAway.minutes()) { //if minutes > 0
        timeAway = `${timeAway.minutes()}:${String(timeAway.seconds()).padStart(2, '0')}`
      } else { //only seconds away
        timeAway = timeAway.seconds() + 's';
      }
      let isTomorrow = nextTrain.date() != now.getDate(); //although timeAway < 1 day, but is it tomorrow?
      if (nextTrain.minutes()) {
        nextTrain = nextTrain.format('h:mma'); //show minutes only when it's not 0, e.g. show 5pm instead of 5:00pm
      } else {
        nextTrain = nextTrain.format('ha');
      }
      if (isTomorrow) {
        nextTrain = 'tomorrow ' + nextTrain;
      }
    }
    newRow.append(`<td>${nextTrain}</td>)`);
    newRow.append(`<td>${timeAway}</td>)`);
    $('#timetable__body').append(newRow); //finally done formatting the row, append it!
  }
}

function resetFirebase() { //this function resets Firebase to the initial default value
  var defaultLines = [{
    lineName: "Class",
    destination: "1101 K St NW",
    maidenVoyageDate: "2017-11-07",
    maidenVoyageTime: "18:30",
    frequency: "7m"
  }, {
    lineName: "Southern Dream",
    destination: "Sydney",
    maidenVoyageDate: "1977-01-15",
    maidenVoyageTime: "08:00",
    frequency: "15m"
  }, {
    lineName: "Furikake",
    destination: "Tokyo",
    maidenVoyageDate: "1989-12-22",
    maidenVoyageTime: "15:00",
    frequency: "2h30m"
  }, {
    lineName: "Breakaway",
    destination: "Iceland",
    maidenVoyageDate: "2008-07-13",
    maidenVoyageTime: "14:00",
    frequency: "4h"
  }, {
    lineName: "Lightning Bolt",
    destination: "Jupiter",
    maidenVoyageDate: "2017-08-08",
    maidenVoyageTime: "11:00",
    frequency: "24h"
  }];
  firebase.database().ref('trainLines').set({}); //empty everything in firebase
  for (let i of defaultLines) {
    firebase.database().ref('trainLines').push(i);
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
