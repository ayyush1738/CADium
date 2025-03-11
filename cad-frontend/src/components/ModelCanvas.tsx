"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

interface ModelCanvasProps {
  modelUrl: string;
  wireframe: boolean;
  color: string;
  bgColor: string;
  DisplayGrid: boolean;
  DisplayAxes: boolean;
  ambientIntensity: number;
  directionalIntensity: number;
  position: { x: number; y: number; z: number };
  scale: number;
}

const ModelCanvas: React.FC<ModelCanvasProps> = ({
  modelUrl,
  wireframe,
  color,
  bgColor,
  DisplayGrid,
  DisplayAxes,
  ambientIntensity,
  directionalIntensity,
  position,
  scale,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const axesHelperRef = useRef<THREE.AxesHelper | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const directionalLightRef = useRef<THREE.DirectionalLight | null>(null);
  const [initialized, setInitialized] = useState(false);

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
      controlsRef.current.autoRotate = false;
    }

    // Lights
    ambientLightRef.current = new THREE.AmbientLight(0xffffff, ambientIntensity);
    sceneRef.current.add(ambientLightRef.current);

    directionalLightRef.current = new THREE.DirectionalLight(0xffffff, directionalIntensity);
    directionalLightRef.current.position.set(5, 10, 7.5);
    sceneRef.current.add(directionalLightRef.current);

    // Helpers
    gridHelperRef.current = new THREE.GridHelper(50, 50);
    sceneRef.current.add(gridHelperRef.current);

    axesHelperRef.current = new THREE.AxesHelper(5);
    sceneRef.current.add(axesHelperRef.current);

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
  }, []);

  useEffect(() => {
    if (!sceneRef.current || !modelUrl || initialized) return;

    const fileExtension = modelUrl.split('.').pop()?.toLowerCase();

    if (fileExtension === "obj") {
      const loader = new OBJLoader();
      loader.load(modelUrl, (object) => {
        addModelToScene(object);
      });
    } else if (fileExtension === "stl") {
      const loader = new STLLoader();
      loader.load(modelUrl, (geometry) => {
        const material = new THREE.MeshStandardMaterial({ color: new THREE.Color(color), wireframe });
        const mesh = new THREE.Mesh(geometry, material);
        addModelToScene(mesh);
      });
    }
  }, [modelUrl, initialized]);


const addModelToScene = (object: THREE.Object3D) => {
  if (modelRef.current) {
    sceneRef.current?.remove(modelRef.current);
  }

  modelRef.current = object;

  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scaleFactor = 5 / maxDim; 
  object.scale.set(scaleFactor, scaleFactor, scaleFactor);
  object.position.sub(center.multiplyScalar(scaleFactor)); 
  object.position.y += (size.y * scaleFactor) / 2; 

  if (modelUrl.toLowerCase().endsWith(".stl")) {
    object.rotation.x = -Math.PI / 2; 
  }

  object.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;

      if (modelUrl.toLowerCase().endsWith(".obj")) {
        mesh.material = new THREE.MeshStandardMaterial({ color: new THREE.Color(color), wireframe });
      } 
      
      else if (mesh.material instanceof THREE.MeshStandardMaterial) {
        mesh.material.color.set(new THREE.Color(color));
        mesh.material.wireframe = wireframe;
      }
    }
  });

  object.position.set(position.x, position.y, position.z);
  sceneRef.current?.add(object);

  setInitialized(true);
};


  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.scale.set(scale, scale, scale);
    }
  }, [scale]);

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.position.set(position.x, position.y, position.z);
    }
  }, [position]);

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material instanceof THREE.MeshStandardMaterial) {
            mesh.material.color.set(new THREE.Color(color));
            mesh.material.wireframe = wireframe;
          }
        }
      });
    }
  }, [color, wireframe]);

  useEffect(() => {
    if (ambientLightRef.current) ambientLightRef.current.intensity = ambientIntensity;
    if (directionalLightRef.current) directionalLightRef.current.intensity = directionalIntensity;
  }, [ambientIntensity, directionalIntensity]);

useEffect(() => {
  if (gridHelperRef.current) {
    gridHelperRef.current.visible = DisplayGrid;
  }
  if (rendererRef.current) {
    rendererRef.current.render(sceneRef.current!, cameraRef.current!);
  }
}, [DisplayGrid]);

useEffect(() => {
  if (axesHelperRef.current) {
    axesHelperRef.current.visible = DisplayAxes;
  }
  if (rendererRef.current) {
    rendererRef.current.render(sceneRef.current!, cameraRef.current!);
  }
}, [DisplayAxes]);


  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.background = new THREE.Color(bgColor);
    }
  }, [bgColor]);

  return <div className="w-full h-full" ref={mountRef} />;
};

export default ModelCanvas;
