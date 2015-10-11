
busesUpdate=function(key){
  var routes = BusesRoutes.find().fetch()[0].routes;
  var str=("http://www.ctabustracker.com/bustime/api/v1/getvehicles?key=".concat(key)+"&rt=");
  routes.reduce(function(pre, cur, idx) {
    if ((idx + 1) % 11 === 0) {
      HTTP.call("GET",str.concat(pre), function(err, res) {
        if (!err) {
          let result = xml2js.parseStringSync(res.content)['bustime-response'];
            if (result.hasOwnProperty('vehicle')) {
              result.vehicle.map((vehicle) => {
                let _id = vehicle.vid[0];
                obj={
                  _id: _id,
                  type: "Feature",
                  properties: {
                    heading: vehicle.hdg[0],
                    id: _id,
                    routeTag: vehicle.rt[0],
                    timestamp:vehicle.tmstmp[0]
                  },
                  geometry:{
                    type: "point",
                    coordinates:vehicle.lon.concat(vehicle.lat)
                  }
                };
                Buses.upsert({_id:_id},{$set:obj},{multi:true});
              });
            }
        }
      });
      return pre = [];
    } else {
      return pre.concat(cur);
    }
  }, []);
}
