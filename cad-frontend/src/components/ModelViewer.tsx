"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import Next.js router
import ModelCanvas from "./ModelCanvas";
import ControlPanel from "./ControlPanel";
import MovementControls from "./MovementConrols";
import { FiCamera, FiDownload, FiArrowLeft } from "react-icons/fi"; // Import Back icon
import { saveAs } from "file-saver";

interface ModelViewerProps {
  modelUrl: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelUrl }) => {
  const router = useRouter(); // Initialize Next.js router
  const [wireframe, setWireframe] = useState(false);
  const [color, setColor] = useState("#C8C8C8");
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [ambientIntensity, setAmbientIntensity] = useState(1);
  const [directionalIntensity, setDirectionalIntensity] = useState(1);
  const [bgColor, setBgColor] = useState("#000000");
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [scale, setScale] = useState(1);

  // Function to take screenshot
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

  // Function to export model
  const exportModel = async () => {
    if (!modelUrl) return;
    try {
      const response = await fetch(modelUrl);
      const blob = await response.blob();
      const fileName = modelUrl.split("/").pop() || "exported_model";

      saveAs(blob, fileName);
    } catch (error) {
      console.error("Error exporting model:", error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center relative bg-gray-900 text-white">
      {/* Title */}
      <h1 className="absolute text-fuchsia-200 top-6 left-10 text-4xl">CADium</h1>

      {/* Go Back Button */}
      <button
        onClick={() => router.push("/")} // Navigate to Home Page
        className="absolute bottom-10 left-6 flex items-center space-x-2 px-4 py-2 bg-fuchsia-300 hover:bg-fuchsia-400 transition-all duration-300 text-black cursor-pointer font-semibold rounded-lg shadow-md"
      >
        <FiArrowLeft size={18} /> <span>Go Back</span>
      </button>

      {/* Buttons for Screenshot & Export */}
      <div className="absolute top-6 right-10 flex space-x-4">
        <button
          onClick={takeScreenshot}
          className="flex items-center space-x-2 px-4 py-2 bg-fuchsia-300 hover:bg-fuchsia-400 transition-all duration-300 text-black cursor-pointer font-semibold rounded-lg shadow-md"
        >
          <FiCamera size={18} /> <span>Screenshot</span>
        </button>

        <button
          onClick={exportModel}
          className="flex items-center space-x-2 px-4 py-2 bg-green-400 hover:bg-green-500 transition-all duration-300 text-black cursor-pointer font-semibold rounded-lg shadow-md"
        >
          <FiDownload size={18} /> <span>Export File</span>
        </button>
      </div>

      {/* 3D Model Canvas */}
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
        scale={scale}
      />

      {/* Control Panel & Movement Controls */}
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
        setScale={setScale}
        scale={scale}
      />
      <MovementControls setPosition={setPosition} />
    </div>
  );
};

export default ModelViewer;
