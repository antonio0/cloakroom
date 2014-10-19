var video = document.querySelector("#camera");
 
navigator.getUserMedia = navigator.getUserMedia || 
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia ||
                         navigator.oGetUserMedia;
 
if (navigator.getUserMedia)
{       
  navigator.getUserMedia({video: true}, handleVideo, videoError);
}
 
function handleVideo(stream)
{
  video.src = window.URL.createObjectURL(stream);
}
 
function videoError(e) {
  // To fill.
}