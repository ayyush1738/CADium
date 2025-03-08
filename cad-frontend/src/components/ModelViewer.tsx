"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

interface ModelViewerProps {
  modelUrl: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelUrl }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const axesHelperRef = useRef<THREE.AxesHelper | null>(null);

  const [wireframe, setWireframe] = useState(false);
  const [color, setColor] = useState("#C8C8C8");
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [ambientIntensity, setAmbientIntensity] = useState(1);
  const [directionalIntensity, setDirectionalIntensity] = useState(1);
  const [bgColor, setBgColor] = useState("#202020");
  const rotationSpeed = 0.15;

  useEffect(() => {
    if (!mountRef.current) return;

    if (rendererRef.current) {
      mountRef.current.removeChild(rendererRef.current.domElement);
      rendererRef.current.dispose();
      rendererRef.current = null;
    }

    if (sceneRef.current) {
      sceneRef.current.clear();
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(bgColor);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 10);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = rotationSpeed;
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xffffff, ambientIntensity);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, directionalIntensity);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const gridHelper = new THREE.GridHelper(20, 20);
    gridHelper.visible = showGrid;
    scene.add(gridHelper);
    gridHelperRef.current = gridHelper;

    const axesHelper = new THREE.AxesHelper(5);
    axesHelper.visible = showAxes;
    scene.add(axesHelper);
    axesHelperRef.current = axesHelper;

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const { clientWidth, clientHeight } = mountRef.current;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      if (rendererRef.current) {
        if (mountRef.current?.contains(rendererRef.current.domElement)) {
          mountRef.current.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
        rendererRef.current = null;
      }

      if (controlsRef.current) {
        controlsRef.current.dispose();
        controlsRef.current = null;
      }

      if (sceneRef.current) {
        sceneRef.current.clear();
      }
    };
  }, [bgColor, showGrid, showAxes, ambientIntensity, directionalIntensity]);

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

        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 5 / maxDim;

        object.scale.setScalar(scaleFactor);
        object.position.sub(center.multiplyScalar(scaleFactor));
        object.position.y += size.y * scaleFactor / 2;

        sceneRef.current?.add(object);
        modelRef.current = object;
      },
      undefined,
      (error) => console.error("Error loading model:", error)
    );
  }, [modelUrl, color, wireframe]);

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full h-[100%]" ref={mountRef} />

      <div className="flex flex-wrap space-x-4 mt-2 bg-stone-500 shadow-lg shadow-fuchsia-100 absolute p-2 px-6 rounded-4xl">
        <button onClick={() => setWireframe(!wireframe)} className="px-4 py-2 bg-green-800 h-10 text-white rounded cursor-pointer">Toggle Wireframe</button>
        <button onClick={() => setShowGrid(!showGrid)} className="px-4 py-2 bg-fuchsia-700 text-white rounded cursor-pointer">Toggle Grid</button>
        <button onClick={() => setShowAxes(!showAxes)} className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer">Toggle Axis</button>
        <div className="flex flex-wrap space-x-4 mt-2">
          <label className="text-sm py-1">Object Color</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="border p-1 rounded"/>
          <label className="text-sm py-1">Background</label>
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="border p-1 rounded"/>
        </div>
      </div>

    </div>
  );
};

export default ModelViewer;




