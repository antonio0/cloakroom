var container = document.getElementById('bg');
var renderer = new FSS.WebGLRenderer();
var scene = new FSS.Scene();
var light = new FSS.Light('#111122', '#FF0022');
var geometry = new FSS.Plane(6000, 4000, 60, 40);
var material = new FSS.Material('#FFFFFF', '#FFFFFF');
var mesh = new FSS.Mesh(geometry, material);
var now, start = Date.now();

function initialise() {
  scene.add(mesh);
  scene.add(light);
  container.appendChild(renderer.element);
  window.addEventListener('resize', resize);
}

function resize() {
  renderer.setSize(container.offsetWidth, container.offsetHeight);
}

function animate() {
  now = Date.now() - start;
  light.setPosition(300*Math.sin(now*0.001), 200*Math.cos(now*0.0005), 60);
  renderer.render(scene);
  requestAnimationFrame(animate);
}

initialise();
resize();
animate();