"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

interface ModelCanvasProps {
  modelUrl: string;
  wireframe: boolean;
  color: string;
  bgColor: string;
  showGrid: boolean;
  showAxes: boolean;
  ambientIntensity: number;
  directionalIntensity: number;
  position: { x: number; y: number; z: number };
}

const ModelCanvas: React.FC<ModelCanvasProps> = ({
  modelUrl,
  wireframe,
  color,
  bgColor,
  showGrid,
  showAxes,
  ambientIntensity,
  directionalIntensity,
  position,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const axesHelperRef = useRef<THREE.AxesHelper | null>(null);

  /** 📌 Three.js Initialization **/
  useEffect(() => {
    if (!mountRef.current) return;

    if (!sceneRef.current) {
      sceneRef.current = new THREE.Scene();
    }
    sceneRef.current.background = new THREE.Color(bgColor);

    if (!cameraRef.current) {
      cameraRef.current = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
      cameraRef.current.position.set(0, 5, 10);
    }

    if (!rendererRef.current) {
      rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
      rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      rendererRef.current.setPixelRatio(window.devicePixelRatio);
      mountRef.current.appendChild(rendererRef.current.domElement);
    }

    if (!controlsRef.current) {
      controlsRef.current = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
      controlsRef.current.enableDamping = true;
      controlsRef.current.autoRotate = true;
      controlsRef.current.autoRotateSpeed = 0.15;
    }

    sceneRef.current.children = sceneRef.current.children.filter(child => !(child instanceof THREE.Light));
    sceneRef.current.add(new THREE.AmbientLight(0xffffff, ambientIntensity));
    const directionalLight = new THREE.DirectionalLight(0xffffff, directionalIntensity);
    directionalLight.position.set(5, 10, 7.5);
    sceneRef.current.add(directionalLight);

    if (!gridHelperRef.current) {
      gridHelperRef.current = new THREE.GridHelper(50, 50);
      sceneRef.current.add(gridHelperRef.current);
    }
    if (!axesHelperRef.current) {
      axesHelperRef.current = new THREE.AxesHelper(5);
      sceneRef.current.add(axesHelperRef.current);
    }

    const animate = () => {
      controlsRef.current?.update();
      rendererRef.current?.render(sceneRef.current!, cameraRef.current!);
    };
    rendererRef.current.setAnimationLoop(animate);

    const handleResize = () => {
      if (!mountRef.current) return;
      const { clientWidth, clientHeight } = mountRef.current;
      cameraRef.current!.aspect = clientWidth / clientHeight;
      cameraRef.current!.updateProjectionMatrix();
      rendererRef.current!.setSize(clientWidth, clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [bgColor, ambientIntensity, directionalIntensity]);

  /** 📌 Load 3D Model with Centering & Scaling **/
  useEffect(() => {
    if (!sceneRef.current || !modelUrl) return;

    const loader = new OBJLoader();
    loader.load(modelUrl, (object) => {
      if (modelRef.current) {
        sceneRef.current?.remove(modelRef.current);
      }

      // Apply wireframe & color
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

      // Attach model to scene
      sceneRef.current?.add(object);
      modelRef.current = object;
    });
  }, [modelUrl, color, wireframe]);

  /** 📌 Toggle Grid & Axes Visibility **/
  useEffect(() => {
    if (gridHelperRef.current) gridHelperRef.current.visible = showGrid;
  }, [showGrid]);

  useEffect(() => {
    if (axesHelperRef.current) axesHelperRef.current.visible = showAxes;
  }, [showAxes]);

  /** 📌 Apply Position Updates **/
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.position.set(position.x, position.y, position.z);
    }
  }, [position]);

  return <div className="w-full h-full" ref={mountRef} />;
};

export default ModelCanvas;
