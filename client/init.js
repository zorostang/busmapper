Meteor.startup(function() {
  Mapbox.load();
  Tracker.autorun(function() {
    Meteor.subscribe('buses', Session.get('publish_object'));
  });
});
