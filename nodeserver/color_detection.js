module.exports = {
  getColor: function(imageName, res) {
    colorDetect(imageName, res);
  }
};


var cv = require('opencv');
var colorDetect = function(imageName, res ) {
 cv.readImage(imageName, function(err, im){
   im.detectObject(cv.FACE_CASCADE, {}, function(err, faces){
   var buckets = [0, 0, 0, 0, 0, 0, 0, 0];

   if( faces.length == 0 )
   {
     res.send("black");
   }

   var face = faces[0];
   im.ellipse(face.x + face.width/2, face.y + face.height/2, face.width/2, face.height/2);
   var c = 3;
   var d = 2;
   var col = [0, 0, 0];
   var tot = 0;
   var bodySize = face.height * c;
   var bodyWidth = face.height * d;
   var bodyYStart = face.y + face.height + face.height / 4;
   var bodyXStart = face.x + face.width / 2 - bodyWidth / 2;
   for( var i = 0; i < bodySize; i++ )
   {
       	for( var j = 0; j < bodyWidth ; j++ )
	{ 
                var pixel = im.pixel(bodyXStart+j, bodyYStart+i);
                buckets[getColorIndex(getHSV(pixel[0], pixel[1], pixel[2]))]++;	
	}
   }
   for( var t = 0; t < 8; t++ )
   {
     console.log(getColorNameFromIndex(t) + " : " + buckets[t]);
   }
   im.ellipse(bodyXStart+bodyWidth/2, bodyYStart+bodySize/2,bodyWidth/2, bodySize/2);
   im.save('./out.jpg');
   res.json( {'color' : getColorNameFromIndex(getMaxIndex(buckets)) } );
  });
})
}

var getMaxIndex = function(c) {
  var bi = 0;
  var b = c[0];
  for( var i = 1; i < 8; i++ )
  {
    if( c[i] > b )
    {
      bi = i;
      b = c[i];
    }
  }
  return bi;
}

var getColorIndex = function(c) 
{
/*  if( c[1] < 0.15 && c[2] < 0.2 )
    return 0;
  else if( c[2] > 0.8 && c[1] < 0.15  )
    return 1;
  else if( c[2] < 0.15 )
    return 2;
  else*/ if( c[0] < 60 )
    return 3;
  else if( c[0] < 120 )
    return 4;
  else if( c[0] < 180 )
    return 5;
  else if( c[0] < 240 )
    return 6;
  else if( c[0] < 300 )
    return 0;
  else
    return 7;
}

var getColorNameFromIndex = function(i){
  if( i == 0 )
    return "gray";
  else if( i == 1  )
    return "white";
  else if( i == 2 )
    return "black"
  else if( i == 3 )
    return "red";
  else if( i == 4 )
    return "yellow";
  else if( i == 5 )
    return "green";
  else if( i == 6 )
    return "blue";
  else
    return "purple"
}

var getColorName = function(c)
{
  if( c[1] < 0.3 && c[2] < 0.2 )
    return "gray";
  if( c[2] > 0.8 && c[1] < 20 )
    return "white";
  else if( c[2] < 0.15 )
    return "black"
  else if( c[0] < 60 )
    return "red";
  else if( c[0] < 120 )
    return "yellow";
  else if( c[0] < 180 )
    return "green";
  else if( c[0] < 240 )
    return "blue";
  else if( c[0] < 300 )
    return "grey";
  else 
    return "purple"
}

var getHSV = function(r,g,b)
{
 var computedH = 0;
 var computedS = 0;
 var computedV = 0;

 r=r/255; g=g/255; b=b/255;
 var minRGB = Math.min(r,Math.min(g,b));
 var maxRGB = Math.max(r,Math.max(g,b));

 // Black-gray-white
 if (minRGB==maxRGB) {
  computedV = minRGB;
  return [0,0,computedV];
 }

 // Colors other than black-gray-white:
 var d = (r==minRGB) ? g-b : ((b==minRGB) ? r-g : b-r);
 var h = (r==minRGB) ? 3 : ((b==minRGB) ? 1 : 5);
 computedH = 60*(h - d/(maxRGB - minRGB));
 computedS = (maxRGB - minRGB)/maxRGB;
 computedV = maxRGB;
 return [computedH,computedS,computedV];
}
