let center;
let marker;
const RADIUS = 5; // this value needs to = value in the serverside publish function
let filterCircle;

let moveMarker = function(e) {
  center = maps.map.getCenter();
  marker.setLatLng(center);
};

let setBounds = function(e) {
  Session.set('publish_object', {position: center, distance: RADIUS});  
};

Template.map.rendered = function() {
  this.autorun(() => {
    if (Mapbox.loaded()) {
      maps.initialize();
      let transitRef = new Firebase('https://publicdata-transit.firebaseio.com/ctabus');
      
      transitRef.on('value', snapshot => {
        console.log(snapshot.val());
      }, errorObject => {
        console.log('The read failed: ' + errorObject.code);
      });
      
      let icon = L.icon({
        iconSize: [20, 20],
        iconUrl: '/images/location-marker.png',
      });

      center = maps.map.getCenter();
      marker = new L.marker(center, {id: 'testId', icon: icon, draggable: false });
      marker.addTo(maps.map);

      maps.map.on('move', moveMarker);
    }
  });
};

Template.map.events({
  'click #locate-me': function(e, t) {
    e.preventDefault();
    Tracker.autorun(function(c) {
      Session.set('gettingLocation', true);
      let pos = Geolocation.latLng();
      if (pos !== null) {
        Session.set('gettingLocation', false);
        marker.setLatLng(pos);
        maps.map.setView(pos);
        c.stop();
      }
    });
  },
});
