let center;
let marker;
let buses;
const RADIUS = 1609; // this value needs to = value in the serverside publish function

let moveMarker = function(e) {
  center = maps.map.getCenter();
  marker.setLatLng(center);
  console.log('pub');
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
  this.autorun(() => {
    buses = Buses.find().fetch();
    if (Mapbox.loaded()) {
      if (window.hasOwnProperty('maps') && maps.map === null) {
        maps.initialize();
        let icon = L.icon({
          iconSize: [20, 20],
          iconUrl: '/images/location-marker.png',
        });

        center = maps.map.getCenter();
        marker = new L.marker(center, {id: 'testId', icon: icon, draggable: false });
        marker.addTo(maps.map);
      }
      maps.map.on('move', moveMarker);
      
        for (key in maps.buses) {
          var removedABus = false

          if (maps.buses.hasOwnProperty(key)) {
            
            _.each(buses, (bus) => {
              if( removedABus ) return;

              if (key !== bus._id) {
                console.log('about to remove marker');
                console.dir(maps.buses[key]);
                maps.removeMarker(maps.buses[key], key);
                removedABus = true;
              }
            });
          }
        }
        _.each(buses, bus => {
          let geojson = {
            type: "Feature",
            properties: {
              heading: bus.properties.heading,
              id: bus.properties.id,
              routeTag: bus.properties.routeTag,
              timestamp: bus.properties.timestamp,
            },
            geometry: {
              type: "Point",
              coordinates: bus.geometry.coordinates,
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
