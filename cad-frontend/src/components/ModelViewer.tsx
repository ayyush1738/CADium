"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

interface ModelViewerProps {
  modelUrl: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelUrl }) => {
  /** 📌 Refs for Three.js elements **/
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const axesHelperRef = useRef<THREE.AxesHelper | null>(null);

  /** 📌 UI Controls **/
  const [wireframe, setWireframe] = useState(false);
  const [color, setColor] = useState("#C8C8C8");
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [ambientIntensity, setAmbientIntensity] = useState(1);
  const [directionalIntensity, setDirectionalIntensity] = useState(1);
  const [bgColor, setBgColor] = useState("#000000");
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });

  const movementStep = 0.5;
  const rotationSpeed = 0.15;

  /** 📌 Three.js Initialization **/
  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize scene
    if (!sceneRef.current) {
      sceneRef.current = new THREE.Scene();
    }
    sceneRef.current.background = new THREE.Color(bgColor);

    // Initialize camera
    if (!cameraRef.current) {
      cameraRef.current = new THREE.PerspectiveCamera(
        75,
        mountRef.current.clientWidth / mountRef.current.clientHeight,
        0.1,
        1000
      );
      cameraRef.current.position.set(0, 5, 10);
    }

    // Initialize renderer
    if (!rendererRef.current) {
      rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
      rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      rendererRef.current.setPixelRatio(window.devicePixelRatio);
      mountRef.current.appendChild(rendererRef.current.domElement);
    }

    // Initialize controls
    if (!controlsRef.current) {
      controlsRef.current = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
      controlsRef.current.enableDamping = true;
      controlsRef.current.autoRotate = true;
      controlsRef.current.autoRotateSpeed = rotationSpeed;
    }

    // Initialize lights
    sceneRef.current.children = sceneRef.current.children.filter(child => !(child instanceof THREE.Light));
    sceneRef.current.add(new THREE.AmbientLight(0xffffff, ambientIntensity));
    const directionalLight = new THREE.DirectionalLight(0xffffff, directionalIntensity);
    directionalLight.position.set(5, 10, 7.5);
    sceneRef.current.add(directionalLight);

    // Initialize grid and axes helpers
    if (!gridHelperRef.current) {
      gridHelperRef.current = new THREE.GridHelper(50, 50);
      sceneRef.current.add(gridHelperRef.current);
    }
    if (!axesHelperRef.current) {
      axesHelperRef.current = new THREE.AxesHelper(5);
      sceneRef.current.add(axesHelperRef.current);
    }

    // Animation loop
    const animate = () => {
      controlsRef.current?.update();
      rendererRef.current?.render(sceneRef.current!, cameraRef.current!);
    };
    rendererRef.current.setAnimationLoop(animate);

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const { clientWidth, clientHeight } = mountRef.current;
      cameraRef.current!.aspect = clientWidth / clientHeight;
      cameraRef.current!.updateProjectionMatrix();
      rendererRef.current!.setSize(clientWidth, clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [bgColor, ambientIntensity, directionalIntensity]);

  /** 📌 Load 3D Model **/
  useEffect(() => {
    if (!sceneRef.current || !modelUrl) return;

    const loader = new OBJLoader();
    loader.load(
      modelUrl,
      (object) => {
        if (modelRef.current) {
          sceneRef.current?.remove(modelRef.current);
        }

        object.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
              color: new THREE.Color(color),
              wireframe: wireframe,
            });
          }
        });

        // Center and scale model
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 5 / maxDim;

        object.scale.setScalar(scaleFactor);
        object.position.sub(center.multiplyScalar(scaleFactor));
        object.position.y += (size.y * scaleFactor) / 2;

        sceneRef.current?.add(object);
        modelRef.current = object;
      },
      undefined,
      (error) => console.error("Error loading model:", error)
    );
  }, [modelUrl, color, wireframe]);

  /** 📌 Toggle Grid & Axes Visibility **/
  useEffect(() => {
    if (gridHelperRef.current) {
      gridHelperRef.current.visible = showGrid;
    }
  }, [showGrid]);

  useEffect(() => {
    if (axesHelperRef.current) {
      axesHelperRef.current.visible = showAxes;
    }
  }, [showAxes]);

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.position.set(position.x, position.y, position.z);
    }
  }, [position]);

  const takeScreenshot = () => {
    if (!rendererRef.current) return;
    const link = document.createElement("a");
    link.href = rendererRef.current.domElement.toDataURL("image/png");
    link.download = "3D_Model_Screenshot.png";
    link.click();
  };

  /** 📌 UI Controls **/
  return (
    <div className="w-full h-screen flex flex-col items-center relative">
      <div className="w-full h-full" ref={mountRef} />

      <div className="flex flex-wrap space-x-4 mt-2 w-3/4 bg-slate-800 shadow-lg shadow-[#bcbcf070] absolute p-2 px-6 rounded-4xl">
        <button 
          onClick={() => setWireframe(!wireframe)}
          className="px-4 py-2 bg-green-800 h-10 text-white rounded cursor-pointer"
        >
          Toggle Wireframe
        </button>

        <button
          onClick={() => setShowGrid(!showGrid)}
          className="px-4 py-2 bg-fuchsia-700 text-white rounded cursor-pointer"
        >
          Toggle Grid
        </button>

        <button
          onClick={() => setShowAxes(!showAxes)}
          className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer"
        >
          Toggle Axis
        </button>

        <div className="flex flex-wrap space-x-4 mt-2">
          <label className="text-sm py-1">Object Color</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="border p-1 rounded" />

          <label className="text-sm py-1">Background</label>
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="border p-1 rounded" />
        </div>
      </div>

      <div className="h-40 w-40 rounded-full bg-gray-600 absolute top-30 left-3/4 right-1/2">
        <button className="mt-18 ml-2 absolute" onClick={() => setPosition((p) => ({ ...p, x: p.x - movementStep }))}>Left</button>
        <button className="mt-18 right-2 absolute" onClick={() => setPosition((p) => ({ ...p, x: p.x + movementStep }))}>Right</button>
        <button className="mt-30 ml-14 absolute" onClick={() => setPosition((p) => ({ ...p, y: p.y - movementStep }))}>Down</button>
        <button className="mt-2 ml-17 absolute" onClick={() => setPosition((p) => ({ ...p, y: p.y + movementStep }))}>Up</button>
        <button onClick={() => setPosition((p) => ({ ...p, z: p.z - movementStep }))}>Backward</button>
        <button onClick={() => setPosition((p) => ({ ...p, z: p.z + movementStep }))}>Forward</button>
        <button onClick={takeScreenshot}>Take Screenshot</button>

      </div>
    </div>
  );
};

export default ModelViewer;
