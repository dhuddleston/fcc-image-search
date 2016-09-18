var moment = require('moment');
var SearchQuery = require('../models/query');

module.exports = function(app, mongoose){
    
    var Bing = require("node-bing-api")({accKey: process.env.BING_KEY});
    
    app.get('/:query', getSearch);
    app.get('/api/latest', getLatest);
    
    function getSearch(req, res){
        var searchTerm = req.params.query;
        var topSize = req.query.offset || 5;
        
        Bing.images(searchTerm, {top:topSize, adult: 'Strict'}, function(error, results, body){
            
            var searchQuery = new SearchQuery();
            
            searchQuery.term = searchTerm;
            var now = moment().toString();
            searchQuery.when = now;
            
            if(searchTerm != "favicon.ico")
            {
               searchQuery.save(function(err, data){
               if(err)
               {
                   res.send(err);
               }
               else
               {
                   console.log(data);
                   res.send(body.d.results.map(limitResults));
               }
            });
            }
        });
    }
    
    // We only need the image url, image text, and page url
    function limitResults(imageData)
    {
        return {
            "imageUrl": imageData.MediaUrl,
            "imageAlt": imageData.Title,
            "pageUrl": imageData.SourceUrl
        };
    }
    
    // Limit the data returned from a SearchQuery object
    function limitHistory(historyData)
    {
        return{
          "searchTerm": historyData.term,
          "when": historyData.when
        };
    }
    
    // Retrieve the last 10 searches made from the database
    function getLatest(req, res)
    {
        // Find all SearchQuery objects
        var query = SearchQuery.find({});
        
        // Sort by date
        query.sort( [['_id', -1]] );
        // Limit to 10 searches
        query.limit(10);
        
        query.exec(function(err, obj){
          if(err){
              res.send(err);
          } 
          else{
              res.send(obj.map(limitHistory));
          }
        });
    }
};