
if (Meteor.isServer) {
  Meteor.startup(function(){
    HTTP.call("GET", "http://www.ctabustracker.com/bustime/api/v1/getvehicles?key=mfZVaeUXL5HctzzxpFGyd5FNX&rt=8",
          function (error, res) {
            if (!error) {
              var result = xml2js.parseStringSync(res.content)
              console.log(result['bustime-response'])
            }
    });
    }
  );
}
