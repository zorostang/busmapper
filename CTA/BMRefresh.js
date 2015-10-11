if (Meteor.isServer) {
  SyncedCron.add({
    name: 'CTATOKEN1',
    schedule: function(parser) {
      // parser is a later.parse object
      return parser.recur().every(1).minute().between(0,29);
  ;
    },
    job: function() {
      busesUpdate(Meteor.settings.private.CTATOKEN1)
    }
  });

  SyncedCron.add({
    name: 'CTATOKEN2',
    schedule: function(parser) {
      // parser is a later.parse object
      return parser.recur().every(1).minute().between(30,60);
  ;
    },
    job: function() {
      busesUpdate(Meteor.settings.private.CTATOKEN2)
    }
  });

  SyncedCron.start();
}
