var _ = require("lodash");
var Scrim = require("../models/Scrim");

module.exports = {
  fittingScrim: function(scrim1,scrim2) {
    for (searchParam in scrim1) {
      if(_.intersection(scrim1[searchParam],scrim2[searchParam]).length == 0) return false;
    }

    return true;
  },

  confirmMsg: function(map,server,skill,teamname) {

    var srv = (server == 'on') ? 'Ours' : 'Yours';

    return [
      'Scrim with ' + teamname + ' ~ [ Map: ' + map + ' / Server: ' + srv + ' / Skill: ' + skill + ']',
      '** Would you like to confirm this scrim? (y/n)'
    ]

  },

  scrimSuccess: function(map,skill,server,message) {
    var srv = (server == 'on') ? 'Ours' : message;

    console.log('> FOUND SCRIM! ')
    console.log('');
    console.log('Map: de_' + map );
    console.log('Skill: ' + skill );
    console.log('Server: ' + srv );
    console.log('');
    console.log('** GL HF :)')
  },

  analyzeScrim: function(message,cfg) {
    if (message.split(" ").length > 0) {

      var userSearched = new Scrim([],[],[]);

      var parts = message.split(" ");

      parts.forEach(function(part) {

        // case insensitive
        part = part.toUpperCase();

        /*
         * SKILL GROUP
        */
        if (_.includes(cfg.allSkills(),part)) {
          for (skill in cfg.skill) {
            if(_.includes(cfg.skill[skill],part)) {
              userSearched.skill = _.union(userSearched.skill,[skill]);
              break;
            }
          }
        }

        /*
         * SERVER
        */
        if (_.includes(cfg.allServers(),part)) {
          for (server in cfg.server) {
            if(_.includes(cfg.server[server],part)) {
              userSearched.server = _.union( userSearched.server,[server]);
              break;
            }
          }
        }

        /*
         * MAP
        */
        if (_.includes(cfg.allMaps(),part)) {
          for (map in cfg.map) {
            if(_.includes(cfg.map[map],part)) {
              userSearched.map = _.union(userSearched.map,[map]);
              break;
            }
          }
        }
      })

      return userSearched;
    }
  },

  analyzeConfirm: function(message,cfg) {

    var confirmation = false;

    if (message.split(" ").length > 0) {
      var parts = message.split(" ");

      parts.forEach(function(part) {
        part = part.toUpperCase();

        if(_.includes(cfg.confirmation,part))
          confirmation = true;
      })
    }

    return confirmation;
  },

  analyzeIPPW: function(message) {

    var ippw = {
      ip: false,
      pw: false
    }

    message = message.toUpperCase();

    return message.includes('CONNECT') && message.includes('PASSWORD');
  },

}
