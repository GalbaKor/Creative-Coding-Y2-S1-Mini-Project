import * as THREE from "three";
//import { Scene } from "three";
import { Noise } from "noisejs";

let clock;

export class theSun {
  //this.collidable = true;
  constructor(scene) {
    this.radius = 30;
    this.heroModel = false;
    this.texture = new THREE.TextureLoader().load("/src/textures/2k_sun.jpg");
    this.sunGeometry = new THREE.SphereGeometry(this.radius, 100, 100);
    this.sunMaterial = new THREE.MeshBasicMaterial({ map: this.texture });

    /*this.sunGeometry = new THREE.WireframeGeometry(
      new THREE.SphereGeometry(20, 30, 30)
    );
    this.sunMaterial = new THREE.LineBasicMaterial({
      color: 0xd8d0d1,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });*/

    this.sun = new THREE.Mesh(this.sunGeometry, this.sunMaterial);
    this.sun.castShadow = true;
    this.sun.position.y = 0;
    this.sun.position.x = 0;

    scene.add(this.sun);
    console.log("the sun is here");
    clock = new THREE.Clock();
    this.noise = new Noise();
  }

  update() {
    let time = clock.getElapsedTime();

    for (let o = 0; o < this.sun.geometry.vertices.length; o++) {
      let p = this.sun.geometry.vertices[o];
      p.normalize().multiplyScalar(
        this.radius * 1 +
          1 +
          0.8 * this.noise.perlin3(p.x * 2 + time, p.y * 2, p.z * 2)
      );
    }
    this.sun.geometry.computeVertexNormals();
    this.sun.geometry.normalsNeedUpdate = true;
    this.sun.geometry.verticesNeedUpdate = true;
  }
}
