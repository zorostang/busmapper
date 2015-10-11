
if (Meteor.isServer) {
  Meteor.startup(function(){
    var BusesRoutes = new Mongo.Collection("busesroutes");
    HTTP.call("GET", "http://www.ctabustracker.com/bustime/api/v1/getroutes?key=mfZVaeUXL5HctzzxpFGyd5FNX",
      function (err, res) {
        if (!err) {
          var result = xml2js.parseStringSync(res.content)['bustime-response'];
          var availableRoutes=result.route.map(function(route){
              return route.rt;
            }).reduce(function(pre,cur){
              return pre.concat(cur)
            },[]);
          BusesRoutes.insert({'routes':availableRoutes},function(err,id){
            if(!err){
              routes=BusesRoutes.find().fetch()[0].routes;
              routes.reduce(function(pre,cur,idx){
                if((idx+1)%11==0){
                  HTTP.call("GET", "http://www.ctabustracker.com/bustime/api/v1/getvehicles?key=mfZVaeUXL5HctzzxpFGyd5FNX&rt=".concat(pre),function(err,res){
                    if (!err) {
                      var result = xml2js.parseStringSync(res.content)['bustime-response'];
                        console.log(result.vehicle)
                    }
                  })
                  return pre=[];
                }
                else{
                    return pre.concat(cur);
                }
              },[])
            }
          });
        }
    });
  })
}
