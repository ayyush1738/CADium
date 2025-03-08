"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";

interface ModelViewerProps {
  modelUrl: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelUrl }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [wireframe, setWireframe] = useState(true);
  const [color, setColor] = useState("#C8C8C8");
  const [rotationSpeed, setRotationSpeed] = useState(1.0);
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [ambientIntensity, setAmbientIntensity] = useState(1);
  const [directionalIntensity, setDirectionalIntensity] = useState(1);
  const [bgColor, setBgColor] = useState("#202020");
  const [useFirstPerson, setUseFirstPerson] = useState(false);

  useEffect(() => {
    if (!modelUrl) return;

    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(bgColor);

    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 5, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    let controls;
    if (useFirstPerson) {
      controls = new PointerLockControls(camera, renderer.domElement);
    } else {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.autoRotate = true;
      controls.autoRotateSpeed = rotationSpeed;
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, ambientIntensity);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, directionalIntensity);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    if (showGrid) {
      const gridHelper = new THREE.GridHelper(30, 30);
      scene.add(gridHelper);
    }

    if (showAxes) {
      const axesHelper = new THREE.AxesHelper(5);
      scene.add(axesHelper);
    }

    const loader = new OBJLoader();
    loader.load(
      modelUrl,
      (object) => {
        object.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
              color: new THREE.Color(color),
              wireframe: wireframe,
            });
          }
        });

        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 5 / maxDim;

        object.scale.setScalar(scaleFactor);
        object.position.set(0, 1.5, 0);

        const center = box.getCenter(new THREE.Vector3());
        object.position.sub(center.multiplyScalar(scaleFactor));

        scene.add(object);
      },
      (xhr) => {
        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      (error) => console.error("Error loading model:", error)
    );

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      controls.dispose();
      renderer.dispose();
    };
  }, [modelUrl, scale, wireframe, color, rotationSpeed, showGrid, showAxes, ambientIntensity, directionalIntensity, bgColor, useFirstPerson]);

  return (
    <div className="w-full h-full bg-gray-200 flex flex-col items-center">
      <div className="w-full h-[90%]" ref={mountRef} />

      <div className="flex flex-wrap space-x-4 mt-2">
        <button onClick={() => setScale(scale * 1.1)} className="px-4 py-2 bg-blue-500 text-white rounded">Zoom In</button>
        <button onClick={() => setScale(scale * 0.9)} className="px-4 py-2 bg-blue-500 text-white rounded">Zoom Out</button>
        <button onClick={() => setWireframe(!wireframe)} className="px-4 py-2 bg-green-500 text-white rounded">Toggle Wireframe</button>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="border p-1 rounded"/>
        <button onClick={() => setShowGrid(!showGrid)} className="px-4 py-2 bg-purple-500 text-white rounded">Toggle Grid</button>
        <button onClick={() => setShowAxes(!showAxes)} className="px-4 py-2 bg-red-500 text-white rounded">Toggle Axes</button>
        <button onClick={() => setUseFirstPerson(!useFirstPerson)} className="px-4 py-2 bg-yellow-500 text-black rounded">Toggle First-Person</button>
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
