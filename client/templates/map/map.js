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
    
    _.each(buses, bus => {
      if (maps.markerExists('id', bus._id)) {
        console.log('Marker already exists');
      } else {
        console.log('Marker added');
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
        maps.addMarker(geojson, 'bus-marker');
      }
    });
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

      let list = [];
      _.each(buses, (bus) => {
        list.push(bus._id);
      });
      _.findWhere(
        _.reject(list, (key) => {return key === maps.buses[bus._id];})), {_id: ;
      
      maps.removeMarker({
        type: "Feature",
        properties: {
          heading: 91,
          id: "805",
          routeTag: "12",
          timestamp: 1442986599685,
          vtype: "bus",
        },
        geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
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
