"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";

const clock = new THREE.Clock();

interface ModelViewerProps {
  modelUrl: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelUrl }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<any>(null);

  const [wireframe, setWireframe] = useState(true);
  const [color, setColor] = useState("#C8C8C8");
  const [rotationSpeed, setRotationSpeed] = useState(1.0);
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [ambientIntensity, setAmbientIntensity] = useState(1);
  const [directionalIntensity, setDirectionalIntensity] = useState(1);
  const [bgColor, setBgColor] = useState("#202020");
  const [useFirstPerson, setUseFirstPerson] = useState(false);

  // 🔹 1️⃣ Initialize Scene, Camera, and Renderer (Only Once)
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(bgColor);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 100);
    camera.position.set(0, 5, 10);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    let controls;
    if (useFirstPerson) {
      controls = new PointerLockControls(camera, renderer.domElement);
    } else {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.autoRotate = true;
      controls.autoRotateSpeed = rotationSpeed;
    }
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xffffff, ambientIntensity);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, directionalIntensity);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    if (showGrid) scene.add(new THREE.GridHelper(30, 30));
    if (showAxes) scene.add(new THREE.AxesHelper(5));

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  // 🔹 2️⃣ Load Model (Only When `modelUrl` Changes)
  useEffect(() => {
    if (!sceneRef.current || !modelUrl) return;

    const loader = new OBJLoader();
    loader.load(
      modelUrl,
      (object) => {
        if (modelRef.current) sceneRef.current?.remove(modelRef.current);

        object.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
              color: new THREE.Color(color),
              wireframe: wireframe,
            });
          }
        });

        // Center & Scale the Model
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 5 / maxDim;

        object.scale.setScalar(scaleFactor);
        object.position.set(0, 1.5, 0);

        const center = box.getCenter(new THREE.Vector3());
        object.position.sub(center.multiplyScalar(scaleFactor));

        sceneRef.current?.add(object);
        modelRef.current = object;
      },
      undefined,
      (error) => console.error("Error loading model:", error)
    );
  }, [modelUrl]);

  // 🔹 3️⃣ Update Model Properties Without Reloading It
  useEffect(() => {
    if (!modelRef.current) return;
    modelRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material.color.set(color);
        (child as THREE.Mesh).material.wireframe = wireframe;
      }
    });
  }, [color, wireframe]);

  return (
    <div className="w-full h-full bg-gray-200 flex flex-col items-center">
      <div className="w-full h-[90%]" ref={mountRef} />

      <div className="flex flex-wrap space-x-4 mt-2">
        <button onClick={() => setWireframe(!wireframe)} className="px-4 py-2 bg-green-500 text-white rounded">Toggle Wireframe</button>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="border p-1 rounded"/>
        <button onClick={() => setShowGrid(!showGrid)} className="px-4 py-2 bg-purple-500 text-white rounded">Toggle Grid</button>
        <button onClick={() => setShowAxes(!showAxes)} className="px-4 py-2 bg-red-500 text-white rounded">Toggle Axes</button>
      </div>

      <div className="flex flex-wrap space-x-4 mt-2">
        <label className="text-sm">Rotation Speed</label>
        <input type="range" min="0.1" max="5" step="0.1" value={rotationSpeed} onChange={(e) => setRotationSpeed(Number(e.target.value))} />

        <label className="text-sm">Ambient Light</label>
        <input type="range" min="0" max="5" step="0.1" value={ambientIntensity} onChange={(e) => setAmbientIntensity(Number(e.target.value))} />

        <label className="text-sm">Directional Light</label>
        <input type="range" min="0" max="5" step="0.1" value={directionalIntensity} onChange={(e) => setDirectionalIntensity(Number(e.target.value))} />

        <label className="text-sm">Background Color</label>
        <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="border p-1 rounded"/>
      </div>
    </div>
  );
};

export default ModelViewer;
