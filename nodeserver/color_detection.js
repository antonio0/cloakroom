module.exports = {
  getColor: function(imageName, res) {
    colorDetect(imageName, res);
  }
};


var cv = require('opencv');
var colorDetect = function(imageName, res ) {
 cv.readImage(imageName, function(err, im){
   im.detectObject(cv.FACE_CASCADE, {}, function(err, faces){

   if( faces.length == 0 )
   {
     res.send("black");
   }

   var face = faces[0];
//   im.ellipse(face.x + face.width/2, face.y + face.height/2, face.width/2, face.height/2);
   var c = 3;
   var d = 1.5;
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
		col[0] += pixel[0];
		col[1] += pixel[1];
		col[2] += pixel[2];	
		tot++;
	}
   }
   col[0] /= tot;
   col[1] /= tot;
   col[2] /= tot;
//    im.ellipse(bodyXStart+bodyWidth/2, bodyYStart+bodySize/2,bodyWidth/2, bodySize/2);
//    im.save('./out.jpg');
   console.log(col);
   res.json( {'color' : getColorName(getHSV(col[0], col[1], col[2])) } );
  });
})
}

var getColorName = function(c)
{
  console.log(c);
  if( c[1] < 0.3 && c[2] < 0.2 )
    return "gray";
  if( (c[2] > 0.6 && c[1] < 20) || c[2] > 0.7 )
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
