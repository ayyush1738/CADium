<template>
  <div id="viewer"></div>
</template>

<script>
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default {
  props: ["filename"],
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      model: null,
    };
  },
  methods: {
    async loadModel() {
      if (!this.filename) {
        console.error("No filename provided");
        return;
      }

      // Scene setup
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xeeeeee); // Light gray background

      // Camera setup
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.camera.position.set(0, 50, 100);

      // Renderer setup
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.getElementById("viewer").innerHTML = ""; // Clear previous content
      document.getElementById("viewer").appendChild(this.renderer.domElement);

      // Add ambient and directional lights
      const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft light
      this.scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
      directionalLight.position.set(1, 1, 1).normalize();
      this.scene.add(directionalLight);

      // Load STL model
      const loader = new STLLoader();
      const modelPath = `http://127.0.0.1:5000/models/${this.filename}`;
      console.log("Loading model from:", modelPath);

      loader.load(
        modelPath,
        (geometry) => {
          console.log("Model loaded successfully", geometry);
          const material = new THREE.MeshStandardMaterial({ color: 0x0055ff, metalness: 0.5, roughness: 0.5 });
          this.model = new THREE.Mesh(geometry, material);

          // Center model
          geometry.computeBoundingBox();
          const center = new THREE.Vector3();
          geometry.boundingBox.getCenter(center);
          this.model.position.sub(center);

          this.scene.add(this.model);

          // Fit camera to model
          const boxSize = Math.max(geometry.boundingBox.max.x, geometry.boundingBox.max.y, geometry.boundingBox.max.z);
          this.camera.position.set(0, boxSize * 1.5, boxSize * 2);
          this.camera.lookAt(0, 0, 0);
        },
        (xhr) => {
          console.log(`Loading model: ${((xhr.loaded / xhr.total) * 100).toFixed(2)}% complete`);
        },
        (error) => {
          console.error("Error loading model:", error);
        }
      );

      // Orbit Controls
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.screenSpacePanning = false;
      this.controls.minDistance = 10;
      this.controls.maxDistance = 500;

      // Grid helper for better visibility
      const gridHelper = new THREE.GridHelper(200, 50);
      this.scene.add(gridHelper);

      this.animate();
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    },
  },
  watch: {
    filename() {
      this.loadModel();
    },
  },
  mounted() {
    this.loadModel();
  },
};
</script>

<style scoped>
#viewer {
  width: 100%;
  height: 100vh;
  background-color: #eeeeee;
}
</style>
