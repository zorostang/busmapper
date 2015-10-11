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

        addMarker: function(geojson, className) {
          if (className === 'bus-marker') {
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

            this.buses[geojson.id] = marker;
            marker.addTo(this.map);
          }
        },

        removeMarker: function(geojson) {
          this.map.removeLayer(this.buses[geojson.id]);
          delete this.buses[geojson.id];
        },

        markerExists: function(key, val) {
          let result = false;
          _.each(this.buses, (element, index, list) => {
            if (element.options[key] === val) {
              result = true;
            }
            return result;
          });
        },
      };
    }
  });
}
