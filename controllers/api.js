// var image = require('../models/image');
var moment = require('moment');
var SearchQuery = require('../models/query');

module.exports = function(app, mongoose){
    
    var Bing = require("node-bing-api")({accKey: process.env.BING_KEY});
    
    app.get('/:query', getSearch);
    app.get('/:latest', getLatest);
    
    function getSearch(req, res){
        var searchTerm = req.params.query;
        var topSize = req.query.offset || 5;
        
        Bing.images(searchTerm, {top:topSize, adult: 'Strict'}, function(error, results, body){
            console.log("Inside Bing.images");
            // console.log(searchTerm);
            // console.log(topSize);
            // console.log(body);
            
            // The body contains an array of objects
            // These objects contain the properties that need to be returned
            
            // body.d.results will return what I'm looking for
            //console.log(body.d.results[0]);
            
              // This will return just the titles
              //var titles = body.d.results.map(function(r){ return r.Title; });
              //console.log(titles.join('\n'));
              
            // JSON.stringify(body);
            
            //res.send({titles});
            
            // This won't work!
            //res.send({"error": "This is an error!"});
            //res.send(JSON.stringify(body));
            
            //res.send(body.d.results);
            
            // res.send(body.d.results.map({
            //     "imageURL": body.d.results.MediaUrl,
            //     "imageAlt": body.d.results.Title,
            //     "pageUrl": body.d.results.SourceUrl
            // }));
            
            // Limit the results being sent
            // console.log(body.d.results.map(limitResults));
            
            // var queryData = new queryObj();
            
            var searchQuery = new SearchQuery();
            
            searchQuery.term = searchTerm;
            //var now = moment();
            // searchQuery.when = moment().format(now, 'MMMM Do YYYY, h:mm:ss a');
            var now = moment().toString();
            searchQuery.when = now;
            
            
            searchQuery.save(function(err, data){
               if(err)
               {
                   res.send(err);
               }
               else
               {
                   res.json(data);
               }
            });
            
            
            res.send(body.d.results.map(limitResults));
            
        });
        // This works!
        //res.send({})
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
    
    function getLatest(req, res)
    {
        // Return the last 10 search queries
        // Directly from MongoDB:
        // db.collection.find().skip(db.collection.count() - N)
        // Using Mongoose:
        // var q = models.Post.find().sort('date', -1).limit(10);
        // q.execFind(function(err, posts) {
        //   // will be of length 10
        // });
        // or
        // Kitten.find(function (err, kittens) {
        // if (err) return console.error(err);
        // console.log(kittens);
        // })
        
        var query = SearchQuery.find().limit(10);
        query.execFind(function(err, posts){
           if(err){
               res.send(err);
           }
           else{
               res.send(query);
           }
        });
    }
    
    // We've already got the basics covered. I think all I have left to do is save the query data into the database
    // So that when a user searches for previous queries they get the data.
    // I've got the schema already
    // So what I need to do is I need to create a new Moment object and save it to the query object when a search is made, as well as the term the user searched for\
    // Note that we only need to find the term. NOT the offset
};