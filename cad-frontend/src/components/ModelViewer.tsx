"use client";

import { useState } from "react";
import ModelCanvas from "./ModelCanvas";
import ControlPanel from "./ControlPanel";
import MovementControls from "./MovementConrols";

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

  return (
    <div className="w-full h-full flex flex-col items-center relative bg-gray-900 text-white">
      <h1 className="absolute text-fuchsia-200 top-6 left-10 text-4xl">CADium</h1>
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
