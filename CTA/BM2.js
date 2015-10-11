
BusesRoutes = new Mongo.Collection("busesroutes");
Buses = new Mongo.Collection("buses");
if (Meteor.isServer) {
  Meteor.startup(function() {
    if(!BusesRoutes.findOne()){
      HTTP.call("GET", "http://www.ctabustracker.com/bustime/api/v1/getroutes?key="+Meteor.settings.private.CTATOKEN1,
        function(err, res) {
          if (!err) {
            let result = xml2js.parseStringSync(res.content)['bustime-response'];
            let availableRoutes = result.route.map(function(route) {
              return route.rt;
            }).reduce(function(pre, cur) {
              return pre.concat(cur);
            }, []);
            BusesRoutes.insert({'routes': availableRoutes},function(err,id){
                if(!err)
                  busesUpdate(Meteor.settings.private.CTATOKEN1);
            });
          }
        });
      }
    });
}
