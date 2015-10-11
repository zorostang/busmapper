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

    buses: [],

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
      if (className === 'station-marker') {
        let markerOptions = {
          icon: icon,
          clickable: true,
          draggable: false,
          keyboard: true,
          zIndexOffset: 100,
        };

        let geojsonLayer = L.geoJson(geojson, {
          pointToLayer: function(feature, latlng) {
            return L.marker(latlng, markerOptions);
          },
          pointToLayer2: (feature, latlng) => L.marker(latlng, markerOptions),
        });

        this.buses.push(geojsonLayer);

        return geojsonLayer;
      }
    },

    removeMarker: function() {

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
