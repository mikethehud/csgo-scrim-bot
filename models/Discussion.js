var _ = require("lodash");

function Discussion(person, scrim, messages, status, sid) {
  this.person = person;
  this.scrim = scrim;
  this.messages = messages;
  this.status = status;
  this.searchId = sid;

  this.addMessage = function(msg, change) {
    var stat = _.clone(this.status);
    this.messages.push(
      {
        status: stat,
        content: msg,
        time: _.now()
      }
    )
  }
}

module.exports = Discussion;
