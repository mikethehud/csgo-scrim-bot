var _ = require("lodash");
var Scrim = require("./models/Scrim");

// Search, change params here to look for different maps
let search = [
  {
    id: 1,
    teamname: '10FT',
    scrim: new Scrim(['high'],['on','off'],['mirage']),
    ippw: ''
  }
]

// IRC Config
let irc = {
	channels: ["#5on5.csgo"],
	server: "dreamhack.se.quakenet.org",
	botName: "HansJimbo"
}

// Text analyzation tool w/ methods
let analyze = {
  skill : {
    low: ['LOW','LOWMID','LOW-MID'],
    mid: ['MID','LOWMID','LOW-MID'],
    high: ['HIGH','MIDHIGH','MID-HIGH','TOP','TOPTEAM','TOPTEAMS','HIGHTEAM','HIGHTEAMS']
  },

  server : {
    off: ['ON','SRVON','SERVERON'],
    on: ['OFF','SRVOFF','SERVEROFF']
  },

  map : {
    cache: ['ANY','ALL','CACHE','DE_CACHE','CCH','CAC'],
    mirage: ['ANY','ALL','MIRAGE','DE_MIRAGE','MRG','MIR'],
    inferno: ['ANY','ALL','INFERNO','DE_INFERNO','INFE','DE_INFE'],
    dust2: ['ANY','ALL','DUST2','DE_DUST2','DD2','D2','DUST'],
    train: ['ANY','ALL','TRAIN','DE_TRAIN','TRN'],
    cbble: ['ANY','ALL','CBBLE','DE_CBBLE','COBBLE','COBBLESTONE','CBBLESTONE','COB'],
    overpass: ['ANY','ALL','OVERPASS','DE_OVERPASS','OPASS','OLOFPASS'],
    nuke: ['ANY','ALL','NUKE','DE_NUKE']
  },

  whichServer : {
    on : ['ON','YOURS','ANY'],
    off : ['OFF','OURS','ANY']
  },

  confirmation: [ 'YES','Y','YEA','YEAH','YEP','OK','K' ],

  allSkills : function() {
    var res = []
    for (var x in this.skill) {
      res = _.union(res,this.skill[x]);
    }
    return res;
  },

  allServers : function() {
    var res = []
    for (var x in this.server) {
      res = _.union(res,this.server[x]);
    }
    return res;
  },

  allMaps : function() {
    var res = []
    for (var x in this.map) {
      res = _.union(res,this.map[x]);
    }
    return res;
  }
}

module.exports = {
  irc: irc,
  analyze: analyze,
  search: search
}
