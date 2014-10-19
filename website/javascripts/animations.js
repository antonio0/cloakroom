var hatsActive = 5;
var jacketsActive = 1;
var hatsDB;
var jacketsDB;

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



var getClothes = function (color1, color2) {
      $(".stage4").fadeOut();

	$.get( "http://178.62.116.18:3003/getHats?gender=male&color=" + color1, function( data ) {
    var clothes = JSON.parse(data);
    hatsDB = clothes.content;
    for (var i in clothes.content) {
      var thing = clothes.content[i];
      console.dir(thing);
      var img = $('<img id="dynamic">'); //Equivalent: $(document.createElement('img'))
      img.attr('src', thing.image.detail);
      img.attr('id', "hats" + i);
      img.attr('height', "160");
      img.attr('class', "garment");
      img.attr('width', "160");
      img.appendTo('#hats');
      binder(thing.sku, img);
    }
    $("#hats5").addClass("active");
    $(".stage5").fadeIn();
	});

  $.get( "http://178.62.116.18:3003/getJackets?gender=male&color=" + color2, function( data ) {
    var clothes = JSON.parse(data);
    jacketsDB = clothes.content;
    for (var i in clothes.content) {
      var thing = clothes.content[i];
      console.dir(thing);
      var img = $('<img id="dynamic">'); //Equivalent: $(document.createElement('img'))
      img.attr('src', thing.image.detail);
      img.attr('id', "jackets" + i);
      img.attr('height', "480");
      img.attr('class', "garment2");
      img.attr('width', "480");
      img.appendTo('#jackets');
      binder(thing.sku, img);
      // img.bind('click',function() {
      //   console.log("IMG No " + i);
      // });
    }
    $("#jackets1").addClass("active");
    $(".stage5").fadeIn();
  });
}
  
  function binder(sku, img) {
    $.get( "http://178.62.116.18:3003/getSiteUrl?sku=" + sku, function(data) {
      img.bind('click', function() {
        window.open(data);
      });
    });
}




$(document).ready(function(){
          $(document).bind("keyup", keyup);

  $(".start").click(function () {

  	$(".start").fadeOut();

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
     $(".stage3").fadeIn();
  	}, 4000);

  	setTimeout(function() {
  	  $(".stage3").fadeIn();
            takePic();
  	}, 6000);

    setTimeout(function() {
      $(".stage3").fadeOut();

      $(".stage4").fadeIn();

      getClothes("black", "green");

    }, 8000);

  });

});

var updateInfo = function () {
  $("#garmentType").text((curr == 'hats') ? 'Hat' : 'Jacket');
  var details;
  if (curr == 'hats') {
    details = hatsDB[hatsActive].brand + ": " + hatsDB[hatsActive]['name'];
  } else {
    details = jacketsDB[jacketsActive].brand + ": " + jacketsDB[jacketsActive]['name'];
  }
  $("#garmentDetails").text(details);

}


var move = function (direction) {
  console.log("moving: " + direction);
  $(".garment").removeClass("active");
  $(".garment2").removeClass("active");

  var offset = (curr == 'hats') ? 160 : 340;

  if (direction == "left") {

    if (curr == 'hats') {
      hatsActive--;
    } else {
      jacketsActive--;
    }

    $("#" + curr).animate({"left":"+="+offset}, 150);
  } else if (direction == "right") {
    if (curr == 'hats') {
      hatsActive++;
    } else {
      jacketsActive++;
    }

    $("#" + curr).animate({"left":"-=" +offset}, 150);    
  } else if (direction == "down") {
    curr = "jackets";
  } else if (direction == "up") {
    curr = "hats";
  }




  $("#hats" + hatsActive).addClass("active");
  $("#jackets" + jacketsActive).addClass("active");
  updateInfo();
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
   if (e.keyCode == 37)
   {
     move('left');
   }
   else if (e.keyCode == 39)
   {
     move('right');
   }
   else if (e.keyCode == 38)
   {
     move('up');
   }
   else if (e.keyCode == 40)
   {
     move('down');
   }
}