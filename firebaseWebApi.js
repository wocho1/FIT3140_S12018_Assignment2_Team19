
function Fit3140() {
  this.checkSetup();
  this.initFirebase();
  this.loadMessages();
}

  Fit3140.prototype.initFirebase = function () {
    this.database = firebase.database();
    this.storage = firebase.storage();
  };


  Fit3140.prototype.loadMessages = function () {
    // Reference to the /messages/ database path.
    this.messagesRef = this.database.ref('motionSensorData');
    // Make sure we remove all previous listeners.
    this.messagesRef.off();

    // Loads the last 50 messages and listen for new ones.
    var setMessage = function (data) {
      var val = data.val();
      this.displayMessage(val.short_messages, val.long_messages, val.visitors);
    }.bind(this);
    this.messagesRef.limitToLast(50).on('child_added', setMessage);
    this.messagesRef.limitToLast(50).on('child_changed', setMessage);
  };

  // Saves a new message on the Firebase DB.
  Fit3140.prototype.saveMessage = function () {
    // Add a new message entry to the Firebase Database.
    this.messagesRef.push({
      short_messages: 0,
      long_messages: 0,
      visitors: 0
    }).then(function () {
      console.log('Done')
    }.bind(this)).catch(function (error) {
      console.error('Error writing new message to Firebase Database', error);
    });
  };

  Fit3140.prototype.displayMessage = function (short_messages, long_messages, visitors) {
    document.getElementById('short_msg').innerText = "Short Messages: " +short_messages;
    document.getElementById('long_msg').innerText = "Long Messages: " +long_messages;
    document.getElementById('visitor').innerText = "Visitors: " +visitors;
  };


  // Checks that the Firebase SDK has been correctly setup and configured.
  Fit3140.prototype.checkSetup = function () {
    if (!window.firebase || !(firebase.app instanceof Function) || !window.config) {
      window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions.');
    } else if (config.storageBucket === '') {
      window.alert('Your Firebase Storage bucket has not been enabled.');
    }
  };


window.onload = function () {
  window.Fit3140 = new Fit3140();
};