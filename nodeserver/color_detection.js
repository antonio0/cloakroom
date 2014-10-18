module.exports = {
  getColor: function(imageName, res) {
    console.log(imageName);
    colorDetect(imageName, res);
  }
};


var cv = require('opencv');
var colorDetect = function(imageName, res ) {
 cv.readImage(imageName, function(err, im){
   im.detectObject(cv.FACE_CASCADE, {}, function(err, faces){

   if( faces.length == 0 )
   {
     console.log(0);
     console.log(0);
     console.log(0);
   }

   var face = faces[0];
//   im.ellipse(face.x + face.width/2, face.y + face.height/2, face.width/2, face.height/2);
   var c = 3;
   var d = 2;
   var col = [0, 0, 0];
   var tot = 0;
   var bodySize = face.height * c;
   var bodyWidth = face.height * d;
   var bodyYStart = face.y + face.height;
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
   res.json( {'color' : col } );
  });
})
}

var converToColor = function(c)
{

}
