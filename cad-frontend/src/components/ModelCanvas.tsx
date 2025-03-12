"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { STLLoader} from "three/examples/jsm/loaders/STLLoader.js";

interface ModelCanvasProps {
  modelUrl: string;
  wireframe: boolean;
  color: string;
  bgColor: string;
  DisplayGrid: boolean;
  DisplayAxes: boolean;
  ambientIntensity: number;
  directionalIntensity: number;
  position: {x: number; y:number; z: number };
  rotation: { x: number;y: number;z: number };
  scale: number;
  setLoading: (loading:boolean) =>void;
}

const ModelCanvas: React.FC<ModelCanvasProps> =({
  modelUrl,
  wireframe,
  color,
  bgColor,
  DisplayGrid,
  DisplayAxes,
  ambientIntensity,
  directionalIntensity,
  position,
  rotation,
  scale,
  setLoading,
})=> {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef =useRef<THREE.Scene | null>(null);
  const modelRef= useRef<THREE.Object3D | null>(null);
  const rendererRef= useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef= useRef<OrbitControls | null>(null);
  const gridHelperRef =useRef<THREE.GridHelper | null>(null);
  const axesHelperRef = useRef<THREE.AxesHelper | null>(null);
  const ambientLightRef =useRef<THREE.AmbientLight | null>(null);
  const directionalLightRef= useRef<THREE.DirectionalLight | null>(null);
  const groundRef =useRef<THREE.Mesh | null>(null);

  useEffect(()=>{
    if (!mountRef.current) return;

    if (!sceneRef.current) {
      sceneRef.current = new THREE.Scene();
    }
    sceneRef.current.background = new THREE.Color(bgColor);

    if (!cameraRef.current) {
      cameraRef.current= new THREE.PerspectiveCamera(
        75,
        mountRef.current.clientWidth/mountRef.current.clientHeight,
        0.1,
        1000
      );
      cameraRef.current.position.set(0, 5, 10);
    }

    if (!rendererRef.current) {
      rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
      rendererRef.current.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight);
      rendererRef.current.setPixelRatio(window.devicePixelRatio);
      rendererRef.current.shadowMap.enabled = true;
      rendererRef.current.shadowMap.type = THREE.PCFSoftShadowMap;
      mountRef.current.appendChild(rendererRef.current.domElement);
    }

    if (!controlsRef.current) {
      controlsRef.current = new OrbitControls(
        cameraRef.current,
        rendererRef.current.domElement
      );
      controlsRef.current.enableDamping = true;
      controlsRef.current.autoRotate = false;
    }

    // Lights
    ambientLightRef.current = new THREE.AmbientLight(0xffffff, ambientIntensity);
    sceneRef.current.add(ambientLightRef.current);

    if (!directionalLightRef.current) {
      directionalLightRef.current = new THREE.DirectionalLight(
        0xffffff,
        directionalIntensity);
      directionalLightRef.current.position.set(5, 10, 7.5);
      directionalLightRef.current.castShadow = true;
      sceneRef.current.add(directionalLightRef.current);

      directionalLightRef.current.shadow.mapSize.width = 1024;
      directionalLightRef.current.shadow.mapSize.height = 1024;
      directionalLightRef.current.shadow.camera.near = 0.1;
directionalLightRef.current.shadow.camera.far = 100; // Extend shadow depth

directionalLightRef.current.shadow.camera.left = -50;
directionalLightRef.current.shadow.camera.right = 50;
directionalLightRef.current.shadow.camera.top = 50;
directionalLightRef.current.shadow.camera.bottom = -50;

directionalLightRef.current.shadow.camera.updateProjectionMatrix();

  }

    if(!groundRef.current) {
      const groundGeometry= new THREE.PlaneGeometry(50,50);
      const groundMaterial =new THREE.ShadowMaterial({ opacity: 0.5 });
      groundRef.current= new THREE.Mesh(groundGeometry,groundMaterial);
      groundRef.current.rotation.x = -Math.PI / 2;
      groundRef.current.position.y =0;
      groundRef.current.receiveShadow= true;
      sceneRef.current.add(groundRef.current);
    }

    gridHelperRef.current= new THREE.GridHelper(150, 150);
    axesHelperRef.current= new THREE.AxesHelper(5);
    if (DisplayGrid)sceneRef.current.add(gridHelperRef.current);
    if (DisplayAxes) sceneRef.current.add(axesHelperRef.current);

    const animate= ()=> {
      controlsRef.current?.update();
      rendererRef.current?.render(sceneRef.current!, cameraRef.current!);
    };
    rendererRef.current.setAnimationLoop(animate);

    return () => {
      rendererRef.current?.setAnimationLoop(null);
    };
  },[]);

  // Load model
  useEffect(() => {
    if (!sceneRef.current || !modelUrl) return;

    setLoading(true);
    const fileExtension = modelUrl.split(".").pop()?.toLowerCase();
    let loader;

    if (fileExtension === "obj") {
      loader = new OBJLoader();
      loader.load(
        modelUrl,
        (object) => {
          addModelToScene(object);
          setLoading(false);
  },
        undefined,
        (error) => {
          console.error("Error loading OBJ model:", error);
          setLoading(false);
        }
      );
    } else if (fileExtension === "stl") {
      loader= new STLLoader();
      loader.load(
        modelUrl,
        (geometry)=> {
          const material= new THREE.MeshStandardMaterial({ color: new THREE.Color(color), wireframe });
          const mesh= new THREE.Mesh(geometry, material);
          addModelToScene(mesh);
          setLoading(false);
        },
        undefined,
        (error)=> {
          console.error("Error loading STL model:", error);
          setLoading(false);
        }
      );
    } else {
      console.error("Unsupported file format:", fileExtension);
      setLoading(false);
    }
  }, [modelUrl]);

  useEffect(()=>{
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
  }, [color,wireframe]);
  

  const addModelToScene= (object: THREE.Object3D) => {
    if (modelRef.current){
      sceneRef.current?.remove(modelRef.current);
    }

    modelRef.current=object;
    object.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(color),
          wireframe,});
        mesh.castShadow =true;
        mesh.receiveShadow= true;
    }
    });

    object.scale.set(scale, scale, scale);
    object.position.set(position.x, position.y, position.z);
    sceneRef.current?.add(object);
  };

  useEffect(()=> {
    if (modelRef.current) {
      modelRef.current.scale.set(scale, scale, scale);
    }
  }, [scale]);

  useEffect(()=> {
    if (modelRef.current) {
      modelRef.current.position.set(position.x, position.y, position.z);
    }
  }, [position]);

  useEffect(()=> {
    if (modelRef.current) {
      modelRef.current.rotation.set(
        THREE.MathUtils.degToRad(rotation.x),
        THREE.MathUtils.degToRad(rotation.y),
        THREE.MathUtils.degToRad(rotation.z)
      );
    }
  }, [rotation]);

  useEffect(()=> {
    if (sceneRef.current) {
      sceneRef.current.background = new THREE.Color(bgColor);
  }
  },[bgColor]);
  useEffect(() => {
    if (ambientLightRef.current) ambientLightRef.current.intensity =ambientIntensity;
    if (directionalLightRef.current) directionalLightRef.current.intensity =directionalIntensity;
  },[ambientIntensity,directionalIntensity]);

  return <div className="w-full h-full" ref={mountRef} />;
};

export default ModelCanvas;
