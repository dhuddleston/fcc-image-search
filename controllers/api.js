module.exports = function(app, mongoose){
    
    var Bing = require("node-bing-api")({accKey: process.env.BING_KEY});
    
    app.get('/:query', getSearch);
    
    function getSearch(req, res){
        var searchTerm = req.params.query;
        var topSize = req.query.offset || 5;
        
        Bing.images(searchTerm, {top:topSize, adult: 'Strict'}, function(error, res, body){
            console.log("Inside Bing.images");
            console.log(searchTerm);
            console.log(topSize);
            console.log(body);
            
            // The body contains an array of objects
            // These objects contain the properties that need to be returned
            
            // body.d.results will return what I'm looking for
            console.log(body.d.results[0]);
            
              // This will return just the titles
              //var titles = body.d.results.map(function(r){ return r.Title; });
              //console.log(titles.join('\n'));
              
            // JSON.stringify(body);
            
            res.send(JSON.stringify(body));
        });
    }
};