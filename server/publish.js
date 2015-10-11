Meteor.startup(function() {
  Buses._ensureIndex({ geometry: '2dsphere'});
});

Meteor.publish('buses', function(obj) {
  if (!obj) {
    console.log('no pub argument');
  }
  else {
    check(obj.position.lat, Number);
    check(obj.position.lng, Number);
    check(obj.distance, Number);
    
    let lat = obj.position.lat;
    let lng = obj.position.lng;
    let distance = obj.distance < 2000 ? obj.distance : 2000;
    
    console.log(lat);
    console.log(lng);
    console.log(distance);
    let buses = Buses.find({
            geometry: {
                $near: {
                    $geometry: { type: "Point",  coordinates: [ lng, lat ] },
                    $minDistance: 0,
                    $maxDistance: distance
                }
            }
          });
    return buses;
  }
});