import * as THREE from "three";
//import { Scene } from "three";
import { Noise } from "noisejs";
import { GUI } from "dat.gui";
import * as Tone from "tone";
//import { MathUtils } from "three";

let clock;
let control;

export class planetClass {
  //this.collidable = true;
  constructor(scene) {
    this.numPlanets = 7; // 7 tracks, 7 planets. RIP Neptune, Uranus (and Pluto? still a planet in my heart)

    // adds an invisible object at 0,0,0.  Then I add each planet to the pivotPoint and by rotating the y of the pivotPoint, I rotate everything attached to it.
    this.pivotPoint = new THREE.Object3D();
    scene.add(this.pivotPoint);

    // don't focus on the planets, radius of 3 for all planets as I couldn't figure out how to space randomly sized planets inside the "for"
    // planet geometry is a sphere geometry with a radius of 3 and enough segments that it looks completely smooth
    this.heroModel = false;

    // Mesh groups, radius and geometry
    this.planetGroup = new THREE.Group();
    this.planetArray = []; // array for console logging
    this.planetGeometries = [];
    this.planetRadius = [];

    this.player = [];
    for (let i = 0; i < this.numPlanets; i++) {
      if (i === 0) {
        console.log("in here");
        this.texture = new THREE.TextureLoader().load(
          "/src/textures/2k_mercury.jpg"
        );
        this.planetRadius.push((this.radius = 2));
        this.planetGeometries.push(
          new THREE.SphereGeometry(this.radius, 100, 100)
        );

        this.player.push(
          new Tone.Player("/src/audio/2_melody.mp3", () => {
            this.player[i].loop = true;
            this.player[i].autostart = true;
            this.player[i].hasPlaybackControl = true;
          }).toDestination()
        );
      } else if (i === 1) {
        this.texture = new THREE.TextureLoader().load(
          "/src/textures/2k_venus_atmosphere.jpg"
        );
        this.planetRadius.push((this.radius = 4));
        this.planetGeometries.push(
          new THREE.SphereGeometry(this.radius, 100, 100)
        );

        this.player.push(
          new Tone.Player("/src/audio/3_upperMelody.mp3", () => {
            this.player[i].loop = true;
            this.player[i].autostart = true;
            this.player[i].hasPlaybackControl = true;
          }).toDestination()
        );
      } else if (i === 2) {
        this.texture = new THREE.TextureLoader().load(
          "/src/textures/2k_earth_daymap.jpg"
        );
        this.planetRadius.push((this.radius = 5));
        this.planetGeometries.push(
          new THREE.SphereGeometry(this.radius, 100, 100)
        );

        this.player.push(
          new Tone.Player("/src/audio/4_bass.mp3", () => {
            this.player[i].loop = true;
            this.player[i].autostart = true;
            this.player[i].hasPlaybackControl = true;
          }).toDestination()
        );
      } else if (i === 3) {
        this.texture = new THREE.TextureLoader().load(
          "/src/textures/2k_mars.jpg"
        );
        this.planetRadius.push((this.radius = 4));
        this.planetGeometries.push(
          new THREE.SphereGeometry(this.radius, 100, 100)
        );

        this.player.push(
          new Tone.Player("/src/audio/5_kick.mp3", () => {
            this.player[i].loop = true;
            this.player[i].autostart = true;
            this.player[i].hasPlaybackControl = true;
          }).toDestination()
        );
      } else if (i === 4) {
        this.texture = new THREE.TextureLoader().load(
          "/src/textures/2k_jupiter.jpg"
        );
        this.planetRadius.push((this.radius = 10));
        this.planetGeometries.push(
          new THREE.SphereGeometry(this.radius, 100, 100)
        );

        this.player.push(
          new Tone.Player("/src/audio/6_bassDrum.mp3", () => {
            this.player[i].loop = true;
            this.player[i].autostart = true;
            this.player[i].hasPlaybackControl = true;
          }).toDestination()
        );
      } else if (i === 5) {
        this.texture = new THREE.TextureLoader().load(
          "/src/textures/2k_saturn.jpg"
        );
        this.planetRadius.push((this.radius = 8));
        this.planetGeometries.push(
          new THREE.SphereGeometry(this.radius, 100, 100)
        );

        this.player.push(
          new Tone.Player("/src/audio/7_snare.mp3", () => {
            this.player[i].loop = true;
            this.player[i].autostart = true;
            this.player[i].hasPlaybackControl = true;
          }).toDestination()
        );
      } else if (i === 6) {
        this.texture = new THREE.TextureLoader().load(
          "/src/textures/2k_eris_fictional.jpg"
        );
        this.planetRadius.push((this.radius = 7));
        this.planetGeometries.push(
          new THREE.SphereGeometry(this.radius, 100, 100)
        );

        this.player.push(
          new Tone.Player("/src/audio/8_hihat.mp3", () => {
            this.player[i].loop = true;
            this.player[i].autostart = true;
            this.player[i].hasPlaybackControl = true;
          }).toDestination()
        );
      }

      this.planetMaterial = new THREE.MeshPhongMaterial({
        map: this.texture
      });
      //let tempPlanet = new THREE.Mesh(this.planetGeometry, this.planetMaterial);
      this.planetArray.push(
        (this.planet = new THREE.Mesh(
          this.planetGeometries[i],
          this.planetMaterial
        ))
      );

      // adds the sound to the corresponding planet mesh
      //this.planetArray[i].add(this.player[i]);

      this.planetArray[i].castShadow = true;
      this.planetArray[i].transparency = true;
      this.planetArray[i].position.y = 0;
      for (let i = 0; i < this.planetArray.length; i++) {
        if (i === 0) {
          this.planetArray[i].position.x = 45 + i * 40;
        } else {
          this.planetArray[i].position.x = 30 + i * 40;
        }
      }

      this.planetGroup.add(this.planetArray[i]);

      console.log(i);
    }

    this.pivotPoint.add(this.planetGroup); //have to add the planet to the scene before you can add the planet to the pivot. Adds the whole planet

    control = new (function () {
      this.rotationSpeedY = 0;
      this.noiseAmt = 0;
      this.melody = 1;
      this.upperMelody = 1;
      this.bass = 1;
      this.kick = 1;
      this.bassDrum = 1;
      this.snare = 1;
      this.hihat = 1;
      /*this.switch = true;*/
      this.playback = 0;
    })();
    addControls(control);

    function addControls(controlObject) {
      var gui = new GUI();
      //this.sphereFolder = gui.addFolder("Sphere geometry");
      gui.add(controlObject, "noiseAmt").min(0).max(10);
      gui.add(controlObject, "rotationSpeedY", -0.1, 0.1, 0.001);
      // this.sphereFolder.open();
      // this.trackVolume = gui.addFolder("Track volume");
      gui.add(controlObject, "melody", 0, 10, 1);
      gui.add(controlObject, "upperMelody", 0, 10, 1);
      gui.add(controlObject, "bass", 0, 10, 1);
      gui.add(controlObject, "kick", 0, 10, 1);
      gui.add(controlObject, "bassDrum", 0, 10, 1);
      gui.add(controlObject, "snare", 0, 10, 1);
      gui.add(controlObject, "hihat", 0, 10, 1);
      /*gui.add(controlObject, "switch").name("light switch");*/
      gui.add(controlObject, "playback", 0, 1, 1);
    }

    clock = new THREE.Clock();
    this.noise = new Noise();
  }

  update() {
    let time = clock.getElapsedTime();

    // playback doesn't work rn
    /*for (let p = 0; p < this.player.length; p++) {
      if (control.playback === 0) {
        this.player[p].play();
      } else {
        this.player[p].pause();
      }
    }*/

    this.pivotPoint.rotation.y += control.rotationSpeedY;
    //console.log(control.rotationSpeedY);

    /*for (let s = 0; s < this.planetArray.length; s++) {
      this.planetRadius[s] += this.player[s].volume.value;
    }*/

    for (let a = 0; a < this.player.length; a++) {
      if (a === 0) {
        this.player[a].volume.value = control.melody;
        console.log(control.melody);
        this.player[a].mute = false;
        this.planetRadius[a] =
          this.radius + (this.player[a].volume.value - 1) / 4;
        //console.log(control.melody.value);
        if (this.player[a].volume.value === 0) {
          this.player[a].mute = true;
          this.planetArray[a].visible = false;
        } else {
          this.planetArray[a].visible = true;
        }
      } else if (a === 1) {
        this.player[a].volume.value = control.upperMelody;
        console.log(control.upperMelody);
        this.player[a].mute = false;
        this.planetRadius[a] =
          this.radius + (this.player[a].volume.value - 1) / 4;
        //console.log(control.melody.value);
        if (this.player[a].volume.value === 0) {
          this.player[a].mute = true;
          this.planetArray[a].material.transparency = true;
          this.planetArray[a].material.opacity = 0;
          this.planetArray[a].visible = false;
        } else {
          this.planetArray[a].visible = true;
        }
      } else if (a === 2) {
        this.player[a].volume.value = control.bass;
        console.log(control.bass);
        this.player[a].mute = false;
        this.planetRadius[a] =
          this.radius + (this.player[a].volume.value - 1) / 4;
        //console.log(control.melody.value);
        if (this.player[a].volume.value === 0) {
          this.player[a].mute = true;
          this.planetArray[a].material.transparency = true;
          this.planetArray[a].material.opacity = 0;
          this.planetArray[a].visible = false;
        } else {
          this.planetArray[a].visible = true;
        }
      } else if (a === 3) {
        this.player[a].volume.value = control.kick;
        console.log(control.kick);
        this.player[a].mute = false;
        this.planetRadius[a] =
          this.radius + (this.player[a].volume.value - 1) / 4;
        //console.log(control.melody.value);
        if (this.player[a].volume.value === 0) {
          this.player[a].mute = true;
          this.planetArray[a].material.transparency = true;
          this.planetArray[a].material.opacity = 0;
          this.planetArray[a].visible = false;
        } else {
          this.planetArray[a].visible = true;
        }
      } else if (a === 4) {
        this.player[a].volume.value = control.bassDrum;
        console.log(control.bassDrum);
        this.player[a].mute = false;
        this.planetRadius[a] =
          this.radius + (this.player[a].volume.value - 1) / 4;
        //console.log(control.melody.value);
        if (this.player[a].volume.value === 0) {
          this.player[a].mute = true;
          this.planetArray[a].material.transparency = true;
          this.planetArray[a].material.opacity = 0;
          this.planetArray[a].visible = false;
        } else {
          this.planetArray[a].visible = true;
        }
      } else if (a === 5) {
        this.player[a].volume.value = control.snare;
        console.log(control.snare);
        this.player[a].mute = false;
        this.planetRadius[a] =
          this.radius + (this.player[a].volume.value - 1) / 4;
        //console.log(control.melody.value);
        if (this.player[a].volume.value === 0) {
          this.player[a].mute = true;
          this.planetArray[a].material.transparency = true;
          this.planetArray[a].material.opacity = 0;
          this.planetArray[a].visible = false;
        } else {
          this.planetArray[a].visible = true;
        }
      } else if (a === 6) {
        this.player[a].volume.value = control.hihat;
        console.log(control.hihat);
        this.player[a].mute = false;
        this.planetRadius[a] =
          this.radius + (this.player[a].volume.value - 1) / 4;
        //console.log(control.melody.value);
        if (this.player[a].volume.value === 0) {
          this.player[a].mute = true;
          this.planetArray[a].material.transparency = true;
          this.planetArray[a].material.opacity = 0;
          this.planetArray[a].visible = false;
        } else {
          this.planetArray[a].visible = true;
        }
      }
    }

    for (let i = 0; i < this.planetArray.length; i++) {
      for (let o = 0; o < this.planetArray[i].geometry.vertices.length; o++) {
        let p = this.planetArray[i].geometry.vertices[o];
        p.normalize().multiplyScalar(
          this.planetRadius[i] * 1 +
            i * 1 +
            1 +
            0.8 *
              this.noise.perlin3(
                p.x * control.noiseAmt + time,
                p.y * control.noiseAmt + i,
                p.z * control.noiseAmt
              )
        );
      }
      this.planetArray[i].geometry.computeVertexNormals();
      this.planetArray[i].geometry.normalsNeedUpdate = true;
      this.planetArray[i].geometry.verticesNeedUpdate = true;
    }
  }
}
