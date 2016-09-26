var http = require("https");

var yelpService = function(){
  var getToken = function(callback){
      var options = {
          "method": "POST",
          "hostname": "api.yelp.com",
          "port": null,
          "path": "/oauth2/token?grant_type=client_credentials&client_id=8GoXswdouIGvjq2J-y1zOA&client_secret=5e3LQUDl08HjfLhDB0RhIrjTkYXkMMrNkQ7W4H0dKzT6L8SXmC7HtEhkntQO4GSF",
      };

      var cb = function(res){
        var chunks = [];

        res.on("data", function (chunk) {
          chunks.push(chunk);
        });

        res.on("end", function () {
          var body = Buffer.concat(chunks);
          callback(null,body.toString());
        });
      };

      http.request(options, cb).end();
  };

  var getBusiness = function(term, location ,callback){
      this.term = term;
      this.location = location;
      var options = {
          "method": "GET",
          "hostname": "api.yelp.com",
          "port": null,
          "path": "/v3/businesses/search?term="+term+"&location="+location,
          "headers": {
            "authorization": "Bearer 2sAKEuoJEJdY-gxUE9dHIzPgKg1XFQwVnCT_4PbQDuJ4jWOX3r1vFdbdvG3rrNRptfouIG50OVgEk_GsT4nj7Yn4vyCHWjOn5VV7bbNFET0AIjSWomH2AdeHNoXlV3Yx",
          }
      };

      var cb = function(res){
        var chunks = [];

        res.on("data", function (chunk) {
          chunks.push(chunk);
        });

        res.on("end", function () {
          var body = Buffer.concat(chunks);
            callback(null,body.toString());
        });
      };

      http.request(options, cb).end();
  };

  return {
    getBusiness: getBusiness,
    getToken: getToken
  };

};


module.exports = yelpService;