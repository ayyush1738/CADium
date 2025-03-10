"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ModelCanvas from "./ModelCanvas";
import ControlPanel from "./ControlPanel";
import MovementControls from "./MovementControls";
import { FiCamera, FiDownload, FiArrowLeft } from "react-icons/fi";
import { saveAs } from "file-saver";

interface ModelViewerProps {
  modelUrl: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelUrl }) => {
  const router = useRouter();
  const [wireframe, setWireframe] = useState(false);
  const [color, setColor] = useState("#C8C8C8");
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [ambientIntensity, setAmbientIntensity] = useState(1);
  const [directionalIntensity, setDirectionalIntensity] = useState(1);
  const [bgColor, setBgColor] = useState("#000000");
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state until the model is fully rendered
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust timing as needed

    return () => clearTimeout(timer);
  }, []);

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
      <h1 className="absolute z-100 text-fuchsia-200 top-6 left-10 text-4xl">CADium</h1>

      {/* Go Back Button */}
      <button
        onClick={() => router.push("/")}
        className="absolute z-100 bottom-10 left-6 flex items-center space-x-2 px-4 py-2 bg-fuchsia-300 hover:bg-fuchsia-400 transition-all duration-300 text-black cursor-pointer font-semibold rounded-lg shadow-md"
      >
        <FiArrowLeft size={18} /> <span>Go Back</span>
      </button>

      {/* Buttons for Screenshot & Export */}
      <div className="absolute top-6 right-10 flex space-x-4">
        <button
          onClick={takeScreenshot}
          className="flex z-100 items-center space-x-2 px-4 py-2 bg-fuchsia-300 hover:bg-fuchsia-400 transition-all duration-300 text-black cursor-pointer font-semibold rounded-lg shadow-md"
        >
          <FiCamera size={18} /> <span>Screenshot</span>
        </button>

        <button
          onClick={exportModel}
          className="flex z-100 items-center space-x-2 px-4 py-2 bg-green-400 hover:bg-green-500 transition-all duration-300 text-black cursor-pointer font-semibold rounded-lg shadow-md"
        >
          <FiDownload size={18} /> <span>Export File</span>
        </button>
      </div>

      {/* Loader */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black flex-col">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <section className="text-2xl font-bold mt-10">Rendering...</section>
        </div>
      )}

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
