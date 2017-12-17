// requires
var irc = require("irc"),
		_ = require("lodash"),
		Helpers = require("./inc/Helpers"),
		Scrim = require("./models/Scrim"),
		Discussion = require("./models/Discussion"),
		Config = require("./config");

// Initialize the search
var searchFor = Config.search;

// Initialize discussions
var discussions = [];

// Create bot
var bot = new irc.Client(Config.irc.server, Config.irc.botName, {
	channels: Config.irc.channels
});

// PUBLIC MESSAGES
bot.addListener("message#", function(from, to, message) {

  message = message.replace(/[^0-9a-zA-Z_]/g,' ');

  const userSearched = Helpers.analyzeScrim(message,Config.analyze);

  // Check if it matches our SearchFor ?
  searchFor.forEach(function(search) {

    // discussion already exists?
    if( !_.find(discussions,[ 'person', from ]) ) {
      if(Helpers.fittingScrim(userSearched,search.scrim)) {

        // FOUND A FITTING SCRIM - YAY! Let's start a discussion
        var d = new Discussion (
          from,
          {
            map: [_.intersection(search.scrim.map,userSearched.map)[0]],
            server: [_.intersection(search.scrim.server,userSearched.server)[0]],
            skill: [_.intersection(search.scrim.skill,userSearched.skill)[0]]
          },
          [],
          1,
          search.id
        )

        var msg = Helpers.confirmMsg(d.scrim.map[0],d.scrim.server[0],d.scrim.skill[0],search.teamname);

        bot.say(from, msg[0]); d.addMessage(msg[0], 1);
        bot.say(from, msg[1]); d.addMessage(msg[1], 1);

        discussions.push(d);
      }
    }
  });
})

// PRIVATE MESSAGES
bot.addListener("pm", function(from, message) {

  ippwmsg = _.clone(message);
  message = message.replace(/[^0-9a-zA-Z_]/g,' ');

  // Check for existing discussion
  var d = _.find(discussions,['person',from]);

  search = _.find(searchFor,['id',d.searchId]);

  if(d) {
    // Message depending on status
    switch(d.status) {

      /**************
      ** ASK FOR CONFIRMATION
      **************/
      case 1:

      // check for potential things in message
      var checkMessage = Helpers.analyzeConfirm(message,Config.analyze);

      if(checkMessage) {
        if(d.scrim.server[0] == 'on') {
          var msg = [
            'connect 5.62.125.168:27015; password joinpw;',
            'See you on~ [Bot from TOPSTRATS.com]'
          ]
          bot.say(from, msg[0]); d.addMessage(msg[0], 3);
          bot.say(from, msg[1]); d.addMessage(msg[1], 3);

          Helpers.scrimSuccess( d.scrim.map[0], d.scrim.skill[0], d.scrim.server[0] );

          // Pull from searchFor, pull from all discussions
          _.remove(searchFor, [ 'id', search.id ]);
          _.remove(discussions, [ 'person', from ] );
          _.filter(discussions, [ 'searchId', search.id ]).forEach(function(todelete) {
            bot.say(todelete.person, 'Sorry, the team found another scrim. I might contact you with another scrim soon! So long ~');
            _.remove(discussions, { 'person': todelete.person, 'searchId': search.id });
          })
        }
        else {
          var msg = 'IP and Password?';
          bot.say(from, msg); d.addMessage(msg, 2);

          d.status = 2;
        }
      }
      else {
        bot.say(from, 'OK, No worries ~');
      }
      break;

      /**************
      ** Waiting for IPPW
      **************/
      case 2:

      // check for ippw
      var ippw = Helpers.analyzeIPPW(ippwmsg);

      if(ippw) {
        var msg = 'See you on~ [Bot from TOPSTRATS.com]';
        bot.say(from, msg); d.addMessage(msg, 3);

        // SCRIM SUCCESS
        Helpers.scrimSuccess( d.scrim.map[0], d.scrim.skill[0], d.scrim.server[0], ippwmsg );


      }
      else {
        var msg = 'Please send a valid connect statement.. (E.G. connect 12.34.56.78:12354; password *****)';
        bot.say(from, msg); d.addMessage(msg, 2);
      }
      break;
    }
  }
  else {
    // No discussion yet? Tell them off ;)
    bot.say(from, 'Hey ' + from + '! I\'m a Bot that helps people find scrims over on TOPSTRATS.COM.. Check it out!')
  }

})
