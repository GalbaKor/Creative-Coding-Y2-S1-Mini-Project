import * as THREE from "three";
//import * as Tone from "tone";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as Tone from "tone";
import { planetClass } from "./planets.js";
import { theSun } from "./sun.js";
//import { Player } from "tone";

let windowWidth, windowHeight;

let scene, sceneHeight, sceneWidth;
sceneWidth = window.innerWidth;
sceneHeight = window.innerHeight;
let camera, renderer, orbit;
let colour, intensity, light;
let ambientLight;
let clock, delta, interval;
let planetLoad, sunLoad;
let container;

let listener, sound, audioLoader;

const views = [
  //sets all the parameters for each viewport location
  {
    left: 0,
    bottom: 0,
    width: 1,
    height: 1.0,
    //background: new THREE.Color(0.5, 0.5, 0.7),
    eye: [0, 0, 1200],
    up: [0, 1, 0],
    fov: 30
    /*updateCamera: function (camera, scene, mouseX) {
      camera.position.x -= mouseX * 0.05;
      camera.position.x = Math.max(Math.min(camera.position.x, 2000), -2000);
      camera.lookAt(camera.position.clone().setY(0));
    }*/
  } /*,
  {
    left: 0.5,
    bottom: 0.5,
    width: 0.5,
    height: 0.5,
    //background: new THREE.Color(0.5, 0.7, 0.7),
    eye: [0, 0, 1400],
    up: [0, 1, 0],
    fov: 30*/
  /*updateCamera: function (camera, scene, mouseX) {
      camera.position.x -= mouseX * 0.05;
      camera.position.x = Math.max(Math.min(camera.position.x, 2000), -2000);
      camera.lookAt(camera.position.clone().setY(0));
    }*/
  //}
  /*{
    left: 0.5,
    bottom: 0,
    width: 0.5,
    height: 0.5,
    background: new THREE.Color(0.7, 0.5, 0.5),
    eye: [0, 1800, 0],
    up: [0, 0, 1],
    fov: 45,
    updateCamera: function (camera, scene, mouseX) {
      camera.position.x -= mouseX * 0.05;
      camera.position.x = Math.max(Math.min(camera.position.x, 2000), -2000);
      camera.lookAt(camera.position.clone().setY(0));
    }
  }*/
];

let startButton = document.getElementById("startButton"); //adds startButton variable using html element
startButton.addEventListener("click", init); //event listenener that when clicked, does the init function

function init() {
  console.log("hello");
  //initiatilises the scene
  sceneCreate();
  cameraCreate();
  orbitControl();

  /*createWireCube();*/

  clock = new THREE.Clock();
  delta = 0;
  interval = 1 / 60;

  planetLoad = new planetClass(scene);
  sunLoad = new theSun(scene);

  /*const player = new Tone.Player("/src/audio/2_melody.mp3", () => {
    player.loop = true;
    player.autostart = true;
  }).toDestination();*/

  play();
  // attempt at making a pivot point for the cube
}
function sceneCreate() {
  //creates the scene by removing overlay and setting up a canvas as large and wide as the window
  //remove overlay
  let overlay = document.getElementById("overlay");
  overlay.remove();
  //create our scene
  //container = document.getElementById("canvasContainer");
  //document.body.appendChild(container);

  sceneWidth = window.innerWidth;
  sceneHeight = window.innerHeight;
  //sceneWidth = container.innerWidth;
  //sceneHeight = container.innerHeight;

  scene = new THREE.Scene();
  //skybox of stars
  /*var urls = [
    "/src/textures/2k_stars_milky_way.jpg",
    "/src/textures/2k_stars_milky_way.jpg",
    "/src/textures/2k_stars_milky_way.jpg",
    "/src/textures/2k_stars_milky_way.jpg",
    "/src/textures/2k_stars_milky_way.jpg",
    "/src/textures/2k_stars_milky_way.jpg"
  ];

  var materialArray = [];
  for (var i = 0; i < 6; i++)
    materialArray.push(
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(urls[i]),
        side: THREE.BackSide
      })
    );

  var skyGeometry = new THREE.SphereGeometry(400, 32, 32);
  var skyMaterial = materialArray;
  var skybox = new THREE.Mesh(skyGeometry, skyMaterial);
  scene.add(skybox);*/

  //window resizer
  //window.addEventListener("resize", onWindowResize, false); //if screen is resized, call the onWindowResize function, else do nothing
}
/*function onWindowResize() {
  //sets the sceneHeight and Width to be the same as the window, relocates camera to center of screen
  //resize & align
  sceneHeight = window.innerHeight;
  sceneWidth = window.innerWidth;
  renderer.setSize(sceneWidth, sceneHeight);
  camera.aspect = sceneWidth / sceneHeight;
  camera.updateProjectionMatrix();
}*/
function cameraCreate() {
  //creates a camera in the middle of the screen
  //create camera

  for (let i = 0; i < views.length; ++i) {
    const view = views[i];
    camera = new THREE.PerspectiveCamera(
      view.fov,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.fromArray(view.eye);
    camera.up.fromArray(view.up);
    view.camera = camera;
  }

  /*camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(313, 0, 80);*/

  //specify our renderer and add it to our document

  //container = document.getElementById("canvasContainer");
  //document.body.appendChild(container);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); //alpha setting needed for background texture.
  //renderer.setSize(container.innerWidth, container.innerHeight);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  //container.appendChild(renderer.domElement);
  const loader = new THREE.TextureLoader();
  const bgTexture = loader.load("/src/textures/2k_stars_milky_way");
  scene.background = bgTexture;

  //lighting
  colour = 0xffffff;
  intensity = 1;
  light = new THREE.DirectionalLight(colour, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);
  ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
}
function orbitControl() {
  //create the orbit controls instance so we can use the mouse move around our scene
  orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enabled = true;
  orbit.enableZoom = true;
  orbit.enablePan = false;
  orbit.minDistance = 50;
  orbit.maxDistance = 800;
}
function play() {
  renderer.setAnimationLoop(() => {
    update();
    render();
  });
}

function update() {
  orbit.update();
  //update stuff in here
  delta += clock.getDelta();

  sunLoad.update();
  if (delta > interval) {
    planetLoad.update();
    delta = delta % interval;
  }
}

function updateSize() {
  if (
    windowWidth !== window.innerWidth ||
    windowHeight !== window.innerHeight
  ) {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    renderer.setSize(windowWidth, windowHeight);
  }
}

function render() {
  updateSize();
  for (let i = 0; i < views.length; ++i) {
    const view = views[i];
    const camera = view.camera;

    const left = Math.floor(windowWidth * view.left);
    const bottom = Math.floor(windowHeight * view.bottom);
    const width = Math.floor(windowWidth * view.width);
    const height = Math.floor(windowHeight * view.height);

    renderer.setViewport(left, bottom, width, height);
    renderer.setScissor(left, bottom, width, height);
    renderer.setScissorTest(true);
    renderer.setClearColor(view.background);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.render(scene, camera);
  }
}
