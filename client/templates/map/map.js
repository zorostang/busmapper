let center;
let marker;
let buses;
const RADIUS = 5; // this value needs to = value in the serverside publish function
let filterCircle;

let moveMarker = function(e) {
  center = maps.map.getCenter();
  marker.setLatLng(center);
};

let setBounds = function(e) {
  Session.set('publish_object', {position: center, distance: RADIUS});  
};

Template.map.helpers({
  buses: function() {
    return Buses.find();
  },
  gettingLocation: function() {
    return Session.get('gettingLocation');
  },
});

Template.map.rendered = function() {
  this.autorun(function() {
    buses = Buses.find().fetch();
    
    if (Mapbox.loaded()) {
      _.each(buses, bus => {
        let geojson = {
          type: "Feature",
          properties: {
            heading: bus.hdg[0],
            id: bus._id,
            routeTag: bus.rt[0],
            timestamp: bus.tmstmp[0],
          },
          geometry: {
            type: "Point",
            coordinates: [bus.lon[0], bus.lat[0]],
          },
        };

        if (maps.markerExists('_id', geojson)) {
          console.log('Marker already exists');
          console.dir(bus._id);
          console.dir(geojson);
        } else {
          console.log('Marker added');
          maps.addMarker(geojson);
        }
      });
    }
  });
  this.autorun(() => {
    if (Mapbox.loaded()) {
      maps.initialize();

      let icon = L.icon({
        iconSize: [20, 20],
        iconUrl: '/images/location-marker.png',
      });

      center = maps.map.getCenter();
      marker = new L.marker(center, {id: 'testId', icon: icon, draggable: false });
      marker.addTo(maps.map);
      
      maps.map.on('move', moveMarker);


      for (key in maps.buses) {
        if (maps.buses.hasOwnProperty(key)) {
          _.each(buses, (bus) => {
            if (key !== bus._id) {
              maps.removeMarker(maps.buses[key]);
            }
          });
        }
      }
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
