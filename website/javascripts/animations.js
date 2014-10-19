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



var getClothes = function (color) {
	$.get( "http://178.62.116.18:3002/getRelatedItems?hats=red&jackets=blue" + color, function( data ) {
	  console.dir(data);
	});
}


$(document).ready(function(){

  $(".start").click(function () {

  	$(".btn").fadeOut();

  	setTimeout(function() {
  	  //$(".welcome").slideUp("slow");
  	  $(".stage1").fadeOut();
  	}, 800);


  	// Smile!
  	setTimeout(function() {
  	  $(".stage2").fadeIn();
  	}, 1300);

  	setTimeout(function() {
  	  $(".stage2").fadeOut();
  	}, 4000);

  	// setTimeout(function() {
  	//   $(".stage3").fadeIn();
  	// }, 1300);

 	setTimeout(function() {

  		takePic();
  	}, 4000);

  	setTimeout(function() {

  		// getClothes("white");
  	  $(".stage5").fadeIn();
  	}, 5000);



  });

});


