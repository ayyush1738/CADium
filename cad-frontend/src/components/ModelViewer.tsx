"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";

interface ModelViewerProps {
  modelUrl: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelUrl }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!modelUrl) return;

    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x20202);

    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 5, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const gridHelper = new THREE.GridHelper(30, 30);
    scene.add(gridHelper);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    const loader = new OBJLoader();
    loader.load(
      modelUrl,
      (object) => {
        object.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
              color: 0xC8C8C8,
              wireframe: true,
            });
          }
        });
    
        // Compute bounding box to determine size
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3()); // Get object size
        const maxDim = Math.max(size.x, size.y, size.z); // Largest dimension
        const scaleFactor = 5 / maxDim; // Normalize to fit within a 5-unit bounding box
    
        object.scale.setScalar(scaleFactor); // Ap\ly scale factor
        object.position.set(0,1.5,0)
    
        // Center the object
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
  }, [modelUrl, scale]);

  return (
    <div className="w-full h-full bg-gray-200 flex flex-col items-center">
      <div className="w-full h-[90%]" ref={mountRef} />
      <div className="flex space-x-4 mt-2">
        <button
          onClick={() => setScale(scale * 1.1)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Zoom In
        </button>
        <button
          onClick={() => setScale(scale * 0.9)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Zoom Out
        </button>
      </div>
    </div>
  );
};

export default ModelViewer;
