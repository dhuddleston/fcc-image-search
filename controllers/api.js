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
    
    // Retrieve the last 10 searches made from the database
    function getLatest(req, res)
    {
        var query = SearchQuery.find({});
        
        query.sort('-date');
        query.limit(10);
        
        query.exec(function(err, obj){
          if(err){
              res.send(err);
          } 
          else{
              res.send(obj);
          }
        });
    }
};