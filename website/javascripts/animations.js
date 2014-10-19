var active = 5;
var clothes;
var curr = "hats";


var handleCallback = function () {

};


var takePic = function () {
    var scale = 1;

        var $output = $("#output");
        var video = $("#camera").get(0);

        var canvas = document.createElement("canvas");

	canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;
    canvas.getContext('2d')
       .drawImage(video, 0, 0, canvas.width, canvas.height);

    // var img = document.createElement("img");
    // img.src = canvas.toDataURL();
    var img = canvas.toDataURL();

 //    $output.prepend(img);
	// $.ajax({
	//   type: "POST",
	//   url: url,
	//   data: data,
	//   success: handleCallback,
	//   dataType: "json"
	// });
};



var getClothes = function (color, type) {
  console.log("lookign for " + color);
	$.get( "http://178.62.116.18:3003/getHats?gender=male&color=" + color, function( data ) {
    clothes = JSON.parse(data);
    for (var i in clothes.content) {
      var thing = clothes.content[i];
      console.dir(thing);
      var img = $('<img id="dynamic">'); //Equivalent: $(document.createElement('img'))
      img.attr('src', thing.image.detail);
      img.attr('id', type + i);
      img.attr('height', "160");
      img.attr('class', "garment");
      img.attr('width', "160");
      img.appendTo('#hats');
    }
    $("#hats5").addClass("active");
    $(".stage5").fadeIn();
	});
}




$(document).ready(function(){

  $(".start").click(function () {

  	$(".btn").fadeOut();

  	setTimeout(function() {
  	  //$(".welcome").slideUp("slow");
  	  $(".stage1").addClass('animated fadeOutDown');
  	}, 800);


  	// Smile!
  	setTimeout(function() {
  	  $(".stage2").fadeIn();
  	}, 1300);

  	setTimeout(function() {
  	  $(".stage2").addClass("animated fadeOutUp");
  	}, 4000);

  	// setTimeout(function() {
  	//   $(".stage3").fadeIn();
  	// }, 1300);

 	setTimeout(function() {

  		takePic();
  	}, 4000);

  	setTimeout(function() {
    $(document).bind("keyup", keyup);
  		getClothes("white", "hats");
  	}, 5000);


  });

});



var move = function (direction) {
  console.log("moving: " + direction);
  $(".garment").removeClass("active");

  if (direction == "left") {
    active--;
    $("#" + curr).animate({"margin-left":"+=160"}, 300);
  } else {
    active++;
    $("#" + curr).animate({"margin-left":"-=160"}, 300);    
  }
  $("#" + curr + active).addClass("active");
}


function keyval(n)
{
    if (n == null) return 'undefined';
    var s= pad(3,n);
    if (n >= 32 && n < 127) s+= ' (' + String.fromCharCode(n) + ')';
    while (s.length < 9) s+= ' ';
    return s;
}

function keyup (e) {
   if (!e) e= event;
   if (e.keyCode == 37) {
    move('left');
   } else if (e.keyCode == 39) {
    move('right');
   }
}
