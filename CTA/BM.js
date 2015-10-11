BusesRoutes = new Mongo.Collection("busesroutes");
Buses = new Mongo.Collection("buses");
if (Meteor.isServer) {
  Meteor.startup(function() {
    HTTP.call("GET", "http://www.ctabustracker.com/bustime/api/v1/getroutes?key=mfZVaeUXL5HctzzxpFGyd5FNX",
      function(err, res) {
        if (!err) {
          let result = xml2js.parseStringSync(res.content)['bustime-response'];
          let availableRoutes = result.route.map(function(route) {
            return route.rt;
          }).reduce(function(pre, cur) {
            return pre.concat(cur);
          }, []);
          BusesRoutes.insert({'routes': availableRoutes }, function(err, id) {
            if (!err) {
              routes = BusesRoutes.find().fetch()[0].routes;
              routes.reduce(function(pre, cur, idx) {
                if ((idx + 1) % 11 === 0) {
                  HTTP.call("GET", "http://www.ctabustracker.com/bustime/api/v1/getvehicles?key=mfZVaeUXL5HctzzxpFGyd5FNX&rt=".concat(pre), function(err, res) {
                    if (!err) {
                      let result = xml2js.parseStringSync(res.content)['bustime-response'];
                        if (result.hasOwnProperty('vehicle')) {
                          result.vehicle.map((vehicle) => { 
                            let _id = vehicle.vid[0];
                            console.log(_id);
                            _.extend(vehicle, {
                              _id: _id,
                            });
                            // Buses.insert(vehicle);
                          });

                          // console.log(result.vehicle);
                          // Buses.insert(result.vehicle);
                        }
                    }
                  });
                  return pre = [];
                } else {
                  return pre.concat(cur);
                }
              }, []);
            }
          });
        }
      });
  });
}
