"use client";

import { useState } from "react";
import ModelCanvas from "./ModelCanvas";
import ControlPanel from "./ControlPanel";
import MovementControls from "./MovementConrols";
import {FiCamera} from 'react-icons/fi'
interface ModelViewerProps {
  modelUrl: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelUrl }) => {
  const [wireframe, setWireframe] = useState(false);
  const [color, setColor] = useState("#C8C8C8"); 
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [ambientIntensity, setAmbientIntensity] = useState(1);
  const [directionalIntensity, setDirectionalIntensity] = useState(1);
  const [bgColor, setBgColor] = useState("#000000"); 
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [scale, setScale] = useState(1); // ✅ New state for resizing the object

  const takeScreenshot = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
  
    requestAnimationFrame(() => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "3D_Model_Screenshot.png";
      link.click();
    });
  };
  

  return (
    <div className="w-full h-full flex flex-col items-center relative bg-gray-900 text-white">
      <h1 className="absolute text-fuchsia-200 top-6 left-10 text-4xl">CADium</h1>
      <button
          onClick={takeScreenshot}
          className="flex absolute top-6 right-10 items-center space-x-2 px-4 py-2 bg-fuchsia-300 hover:bg-fuchsia-400 transition-all duration-300 text-black cursor-pointer font-semibold rounded-lg shadow-md"
        >
          <FiCamera size={18} /> <span>Screenshot</span>
      </button>
      <ModelCanvas
        modelUrl={modelUrl}
        wireframe={wireframe}
        color={color}
        bgColor={bgColor}
        showGrid={showGrid}
        showAxes={showAxes}
        ambientIntensity={ambientIntensity}
        directionalIntensity={directionalIntensity}
        position={position}
        scale={scale} // ✅ Passing scale to ModelCanvas
      />
      <ControlPanel
        setWireframe={setWireframe}
        setShowGrid={setShowGrid}
        setShowAxes={setShowAxes}
        setColor={setColor}
        setBgColor={setBgColor}
        color={color} 
        bgColor={bgColor} 
        setAmbientIntensity={setAmbientIntensity}
        setDirectionalIntensity={setDirectionalIntensity}
        ambientIntensity={ambientIntensity}
        directionalIntensity={directionalIntensity}
        setScale={setScale} // ✅ Pass scale setter to ControlPanel
        scale={scale} // ✅ Pass current scale
      />
      <MovementControls setPosition={setPosition} />
    </div>
  );
};

export default ModelViewer;
