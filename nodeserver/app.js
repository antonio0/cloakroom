var express = require('express')
var app     = express()
var path    = require('path');
var request = require('request');


app.use(express.static(path.join(__dirname, 'static')));
//app.use(express.urlencoded);
//app.use(express.json());

app.all('/*', function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorisation-Token");
        next();
      });


app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.post('/clothes', function (req, res) {
  var color = req.param('color');
});

var server = app.listen(3003, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

});

// get categories list for item of given SKU
app.get('/getCategories', function(req,res) {
  var sku = req.param('sku');

  request.get(
    'https://api.zalando.com/articles/'+sku,
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var body = JSON.parse(body);
        res.send(body.categoryKeys);
      }
    }
  );

});

// Get "wear it with" list for a random item of a given color,type,gender
app.get('/getRelatedItems', function (req, res) {

  var color = req.param('color');
  var type = req.param('type');
  var gender = req.param('gender');

  var gender2 = 'mens';
  if (gender == 'female') gender2 = 'womens';

  // get first item SKU
  request.get( //TODO: gender mens-clothing
    'https://api.zalando.com/articles/?category='+gender2+'-clothing-'+type+'&ageGroup=adult&pageSize=2&gender='+gender+'&fullText='+color+'%20'+type,
    function (error, response, body) {

    //console.log(response);
    //console.log(body);
    console.log(body);
        if (!error && response.statusCode == 200) {
            var body = JSON.parse(body);
            var sku = body.content[0].sku;

            // get shop url
            request.get(
              "https://api.zalando.com/articles/"+sku,
              function(error,response,body) {
                if (!error && response.statusCode == 200) {
                    var body = JSON.parse(body);
                    var shopUrl = body.shopUrl;
                    console.log(shopUrl);
                    shopUrl = shopUrl.replace("http://www.zalando.co.uk/", "");
                    shopUrl = shopUrl.replace(".html", "");

                    var similarUrl = "http://www.zalando.co.uk/reco/ws?res=2boxes&c=p&ignore=SE622D0F4-Q11&urlKey="+shopUrl+"&size=12&min=12&topseller=true&view=s&zs=4";

                    request.get(
                      similarUrl,
                      function(error,response,body){
                        if (!error && response.statusCode == 200) {
                            var body = JSON.parse(body);
                            var recommendedArticles = body[1].recommendedArticles;
                            for (entry in recommendedArticles) {
                              var url = entry.link;
                              url = url.split(":").getLast();
                              var sku = url[url.length-1];

                              request.get(
                                '/getCategories',
                                function(error, response, body) {
                                  var item = JSON.parse('body');
                                  entry.categoryKeys = item.categoryKeys;
                                }
                              );
                            }

                            res.send(recommendedArticles);
                        }
                      }

                    );

                }
              }
            );
        }

    }
  );
});

app.get("/getJackets", function(req,res) {
  var color = req.param('color');
  var gender = req.param('gender');

  var gender2 = 'mens';
  if (gender == 'female') gender2 = 'womens';

  var request = require('request');
  request.get(
    "https://api.zalando.com/articles/?category="+gender2+"-clothing-jackets&color="+color+"&gender="+gender+"&ageGroup=adult&fullText="+color+"%20jacket",
    function(error,response,body){
      if (!error && response.statusCode==200) {
        res.send(body);
      }
    }
  );
});

app.get("/getHats", function(req,res) {
  var color = req.param('color');
  var gender = req.param('gender');

  var gender2 = 'mens';
  if (gender == 'female') gender2 = 'womens';

  var request = require('request');
  request.get(
    "https://api.zalando.com/articles/?category="+gender2+"-hats-caps&color="+color+"&gender="+gender+"&ageGroup=adult",
    function(error,response,body){
      if (!error && response.statusCode==200) {
        res.send(body);
      }
    }
  );
});

app.get("/getTrousers", function(req,res) {
  var color = req.param('color');
  var gender = req.param('gender');

  var gender2 = 'mens';
  if (gender == 'female') gender2 = 'womens';

  var request = require('request');
  request.get(
    "https://api.zalando.com/articles/?category="+gender2+"-trousers-chinos&color="+color+"&gender="+gender+"&ageGroup=adult&fullText="+color+"%20trousers",
    function(error,response,body){
      if (!error && response.statusCode==200) {
        res.send(body);
      }
    }
  );
});

app.post('/clothes', function (req, res) {
  var color = req.param('color');
  var type = req.param('type');

  var request = require('request');
  request.post(
    'http://www.yoursite.com/formpage',
    { },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body)
        }
    }
  );
})
