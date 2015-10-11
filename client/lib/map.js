let settings = Meteor.settings;
let mapboxToken = settings && settings.public.mapbox;

if (!mapboxToken) {
  throw new Error('No mapboxToken token found in settings.json');
} else {
  Tracker.autorun(() => {
    if (Mapbox.loaded()) {
      console.log('mapbox loaded');
      maps = {
        map: null,

        buses: {},

        initialize: function() {
          console.log('maps.initialize()');
          let chicago = new L.LatLng(41.8763499, -87.6514);

          let mapNode = $('.map')[0];
          let mapOptions = {
            infoControl: false,
            accessToken: mapboxToken,
            center: chicago,
            zoom: 14,
            zoomControl: false,
          };

          this.map = new L.mapbox.map(mapNode, 'zorostang.him49njf', mapOptions);
        },

        addMarker: function(geojson) {
          let icon = L.AwesomeMarkers.icon({
            prefix: 'fa',
            icon: 'bus',
            markerColor: 'blue',
          });

          let markerOptions = {
            icon: icon,
            clickable: true,
            draggable: false,
            keyboard: true,
            zIndexOffset: 100,
          };

          let marker = new L.geoJson(geojson, {
            pointToLayer: (feature, latlng) => L.marker(latlng, markerOptions),
          });

          this.buses[geojson.properties.id] = marker;
          marker.addTo(this.map);
          console.log('marker added');
        },

        removeMarker: function(geojson) {
          this.map.removeLayer(this.buses[geojson.id]);
          delete this.buses[geojson.id];
        },

        markerExists: function(key, val) {
          let result = false;
          console.log('markerExists()');
          console.dir(this.buses[key]);
          if (this.buses[key] === val) {
            result = true;
          }
          // console.log(key)
          // if (key==val.properties.id){
          //   result=true;
          // }
          return result;
        },
      };
    }
  });
}
