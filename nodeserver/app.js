var express = require('express')
var app     = express()
var path    = require('path');
var request = require('request');
var formidable = require('formidable');
var detect = require('./color_detection.js');
var bodyParser = require('body-parser')


app.use(express.static(path.join(__dirname, 'static')));
//app.use(bodyParser.urlencoded);
//app.use(bodyParser.json());

app.all('/*', function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorisation-Token");
        next();
      });

app.post('/color_detect', function(req, res) {
//  console.log(req.body);
req.on('data', function(chunk) {
      console.log("Received body data:");
      console.log(chunk.toString());
    });
  
/*  var base64Data = req.body.replace(/^data:image\/png;base64,/, "");

  require("fs").writeFile("out.png", base64Data, 'base64', function(err) {
    console.log(err);
  });
//  var form = new formidable.IncomingForm();
//  form.parse(req, function(err, field, files){});
//  form.on('end', function(fields, files) {
//    var fullname = this.openedFiles[0].path;
//    detect.getColor(fullname, res);
//  });  
*/
})

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
/*  var color = req.param('color');
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
  );*/
res.send('{"content":[{"sku":"ES422G018-802","name":"Suit jacket - black","color":"Black","sizes":["36R","38R","40R","42R","44R","46R","38L","40L","42L","44L"],"image":{"detail":"http://178.62.116.18:3003/Jacket/1.png","thumbnail":"https://secure-i5.ztat.net/thumb_hd/ES/42/2G/01/88/02/ES422G018-802@5.1.jpg"},"price":{"currency":"GBP","value":105,"formatted":"£105.00"},"originalPrice":{"currency":"GBP","value":130,"formatted":"£130.00"},"brand":"ESPRIT Collection"},{"sku":"3CR42B01Y-802","name":"KIWI LONG - Outdoor jacket - black","color":"Black","sizes":["L","XL","XXL","M","S"],"image":{"detail":"http://178.62.116.18:3003/Jacket/2.png","thumbnail":"https://secure-i3.ztat.net/thumb_hd/3C/R4/2B/01/Y8/02/3CR42B01Y-802@1.1.jpg"},"price":{"currency":"GBP","value":100,"formatted":"£100.00"},"originalPrice":{"currency":"GBP","value":100,"formatted":"£100.00"},"brand":"Craghoppers"},{"sku":"SD022G001-Q11","name":"641 - Leather jacket - black","color":"Black","sizes":["40","38","46","42","36","44"],"image":{"detail":"http://178.62.116.18:3003/Jacket/3.png","thumbnail":"https://secure-i2.ztat.net/thumb_hd/SD/02/2G/00/1Q/11/SD022G001-Q11@1.1.jpg"},"price":{"currency":"GBP","value":720,"formatted":"£720.00"},"originalPrice":{"currency":"GBP","value":720,"formatted":"£720.00"},"brand":"SchottMadeinUSA"},{"sku":"AM122G005-909","name":"BOMBERS-Lightjacket-black","color":"Black","sizes":["XS","S","M","XL","L"],"image":{"detail":"http://178.62.116.18:3003/Jacket/4.png","thumbnail":"https://secure-i1.ztat.net/thumb_hd/AM/12/2G/00/59/09/AM122G005-909@1.1.jpg"},"price":{"currency":"GBP","value":130,"formatted":"£130.00"},"originalPrice":{"currency":"GBP","value":145,"formatted":"£145.00"},"brand":"AmericanCollege"},{"sku":"UR622J004-851","name":"Summerjacket-black","color":"Black","sizes":["XL","XXL","M","L","S","XS","3XL"],"image":{"detail":"http://178.62.116.18:3003/Jacket/5.png","thumbnail":"https://secure-i2.ztat.net/thumb_hd/UR/62/2J/00/48/51/UR622J004-851@12.jpg"},"price":{"currency":"GBP","value":42,"formatted":"£42.00"},"originalPrice":{"currency":"GBP","value":42,"formatted":"£42.00"},"brand":"UrbanClassics"},{"sku":"UR622J004-850","name":"Tracksuittop-black","color":"Black","sizes":["S","L","XXL","M","XL","XS","3XL"],"image":{"detail":"http://178.62.116.18:3003/Jacket/6.png","thumbnail":"https://secure-i1.ztat.net/thumb_hd/UR/62/2J/00/48/50/UR622J004-850@12.1.jpg"},"price":{"currency":"GBP","value":42,"formatted":"£42.00"},"originalPrice":{"currency":"GBP","value":42,"formatted":"£42.00"},"brand":"UrbanClassics"},{"sku":"SD022G002-Q11","name":"613-Leatherjacket-black","color":"Black","sizes":["46","44","36","40","38","42"],"image":{"detail":"http://178.62.116.18:3003/Jacket/7.png","thumbnail":"https://secure-i2.ztat.net/thumb_hd/SD/02/2G/00/2Q/11/SD022G002-Q11@1.1.jpg"},"price":{"currency":"GBP","value":730,"formatted":"£730.00"},"originalPrice":{"currency":"GBP","value":730,"formatted":"£730.00"},"brand":"SchottMadeinUSA"}],"totalElements":1058,"totalPages":53,"page":1,"size":20}');
});

app.get("/getHats", function(req,res) {
/*  var color = req.param('color');
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
  );*/
res.send('{"content":[{"sku":"C1454E00J-802","name":"BOBBLE WATCH CAP - Hat - black","color":"Black","sizes":["One Size"],"image":{"detail":"http://178.62.116.18:3003/Hat/1.png","thumbnail":"https://secure-i3.ztat.net/thumb_hd/C1/45/4E/00/J8/02/C1454E00J-802@8.jpg"},"price":{"currency":"GBP","value":28.00,"formatted":"£28.00"},"originalPrice":{"currency":"GBP","value":28.00,"formatted":"£28.00"},"brand":"Carhartt"},{"sku":"JA252E00J-Q00","name":"LASSE - Hat - black","color":"Black","sizes":["Onesize"],"image":{"detail":"http://178.62.116.18:3003/Hat/2.png","thumbnail":"https://secure-i4.ztat.net/thumb_hd/JA/25/2E/00/JQ/00/JA252E00J-Q00@1.1.jpg"},"price":{"currency":"GBP","value":16.00,"formatted":"£16.00"},"originalPrice":{"currency":"GBP","value":18.00,"formatted":"£18.00"},"brand":"Jack & Jones"},{"sku":"LA252E011-802","name":"Hat - black","color":"Black","sizes":["Onesize"],"image":{"detail":"http://178.62.116.18:3003/Hat/3.png","thumbnail":"https://secure-i3.ztat.net/thumb_hd/LA/25/2E/01/18/02/LA252E011-802@1.1.jpg"},"price":{"currency":"GBP","value":25.00,"formatted":"£25.00"},"originalPrice":{"currency":"GBP","value":25.00,"formatted":"£25.00"},"brand":"Lacoste"},{"sku":"LE252H00E-802","name":"SET - Hat - black","color":"Black","sizes":["S/M","L/XL"],"image":{"detail":"http://178.62.116.18:3003/Hat/4.png","thumbnail":"https://secure-i3.ztat.net/thumb_hd/LE/25/2H/00/E8/02/LE252H00E-802@1.1.jpg"},"price":{"currency":"GBP","value":31.00,"formatted":"£31.00"},"originalPrice":{"currency":"GBP","value":31.00,"formatted":"£31.00"},"brand":"Levi\’s®"},{"sku":"VA254E00G-802","name":"MILFORD - Hat - black","color":"Black","sizes":["One Size"],"image":{"detail":"http://178.62.116.18:3003/Hat/4.png","thumbnail":"https://secure-i3.ztat.net/thumb_hd/VA/25/4E/00/G8/02/VA254E00G-802@1.1.jpg"},"price":{"currency":"GBP","value":20.00,"formatted":"£20.00"},"originalPrice":{"currency":"GBP","value":20.00,"formatted":"£20.00"},"brand":"Vans"},{"sku":"VA252E011-802","name":"Cap - black","color":"Black","sizes":["Onesize"],"image":{"detail":"http://178.62.116.18:3003/Hat/5.png","thumbnail":"https://secure-i3.ztat.net/thumb_hd/VA/25/2E/01/18/02/VA252E011-802@1.1.jpg"},"price":{"currency":"GBP","value":25.00,"formatted":"£25.00"},"originalPrice":{"currency":"GBP","value":25.00,"formatted":"£25.00"},"brand":"Vans"},{"sku":"G3544A00P-802","name":"AIR GT AS - Cap - black","color":"Black","sizes":["One Size"],"image":{"detail":"http://178.62.116.18:3003/Hat/6.png","thumbnail":"https://secure-i3.ztat.net/thumb_hd/G3/54/4A/00/P8/02/G3544A00P-802@1.1.jpg"},"price":{"currency":"GBP","value":39.00,"formatted":"£39.00"},"originalPrice":{"currency":"GBP","value":39.00,"formatted":"£39.00"},"brand":"Gore Running Wear"},{"sku":"TH344A011-802","name":"DENALI THERMAL BEANIE - Hat - black","color":"Black","sizes":["L/XL"],"image":{"detail":"http://178.62.116.18:3003/Hat/7.png","thumbnail":"https://secure-i2.ztat.net/thumb_hd/TH/34/4A/01/18/02/TH344A011-802@1.jpg"},"price":{"currency":"GBP","value":21.00,"formatted":"£21.00"},"originalPrice":{"currency":"GBP","value":25.00,"formatted":"£25.00"},"brand":"The North Face"}],"totalElements":197,"totalPages":10,"page":1,"size":20}');
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
