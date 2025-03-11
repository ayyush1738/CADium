"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import ModelCanvas from "./ModelCanvas";
import ControlPanel from "./ControlPanel";
import MovementControls from "./MovementControls";
import { FiCamera, FiArrowLeft, FiRefreshCcw } from "react-icons/fi";

interface ModelRendererProps {
  modelUrl: string;
}

const ModelRenderer: React.FC<ModelRendererProps> = ({ modelUrl }) => {
  const router = useRouter();
  const [wireframe, setWireframe] = useState(false);
  const [color, setColor] = useState("#C8C8C8");
  const [DisplayGrid, setDisplayGrid] = useState(true);
  const [DisplayAxes, setDisplayAxes] = useState(true);
  const [ambientIntensity, setAmbientIntensity] = useState(1);
  const [directionalIntensity, setDirectionalIntensity] = useState(1);
  const [bgColor, setBgColor] = useState("#000000");
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);
  const [targetFormat, setTargetFormat] = useState("obj"); // Default format

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
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

  const convertAndDownloadModel = async () => {
    if (!modelUrl) return;
    try {
      setConverting(true);
      const fileName = modelUrl.split("/").pop();
      if (!fileName) return;

      // Call the backend API for conversion
      const response = await fetch(`http://localhost:5000/convert/${fileName}/${targetFormat}`);
      const result = await response.json();

      if (response.ok) {
        const convertedModelUrl = result.download_url;
        
        // Automatically download the converted file
        const link = document.createElement("a");
        link.href = convertedModelUrl;
        link.download = result.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error("Conversion failed:", result.error);
      }
    } catch (error) {
      console.error("Error converting model:", error);
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center relative bg-gray-900 text-white">
      <h1 className="absolute z-100 text-fuchsia-200 top-6 left-10 text-4xl">CADium</h1>

      <button
        onClick={() => router.push("/")}
        className="absolute z-100 bottom-10 left-6 flex items-center space-x-2 px-4 py-2 bg-fuchsia-300 hover:bg-fuchsia-400 transition-all duration-300 text-black cursor-pointer font-semibold rounded-lg shadow-md"
      >
        <FiArrowLeft size={18} /> <span>Go Back</span>
      </button>

      <div className="absolute top-6 right-10 flex space-x-4">
        <button
          onClick={takeScreenshot}
          className="flex z-100 items-center space-x-2 px-4 py-2 bg-fuchsia-300 hover:bg-fuchsia-400 transition-all duration-300 text-black cursor-pointer font-semibold rounded-lg shadow-md"
        >
          <FiCamera size={18} /> <span>Screenshot</span>
        </button>

        {/* Format Selection Dropdown */}
        <select
          value={targetFormat}
          onChange={(e) => setTargetFormat(e.target.value)}
          className="px-4 py-2 z-100 bg-blue-100 hover:bg-blue-200 border-0  cursor-pointer text-black rounded-md"
        >
          <option value="obj">Convert to OBJ</option>
          <option value="stl">Convert to STL</option>
        </select>

        {/* Convert & Download Button */}
        <button
          onClick={convertAndDownloadModel}
          disabled={converting}
          className={`flex z-100 items-center space-x-2 px-4 py-2 ${
            converting ? "bg-gray-400 cursor-not-allowed" : "bg-green-400 hover:bg-green-500"
          } transition-all duration-300 text-black cursor-pointer font-semibold rounded-lg shadow-md`}
        >
          <FiRefreshCcw size={18} />
          <span>{converting ? "Converting..." : "Convert & Download"}</span>
        </button>
      </div>

      {/* Loader */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black flex-col">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <section className="text-2xl font-bold mt-10">Rendering...</section>
        </div>
      )}

      <ModelCanvas
        modelUrl={modelUrl}
        wireframe={wireframe}
        color={color}
        bgColor={bgColor}
        DisplayGrid={DisplayGrid}
        DisplayAxes={DisplayAxes}
        ambientIntensity={ambientIntensity}
        directionalIntensity={directionalIntensity}
        position={position}
        rotation={rotation}
        scale={scale}
      />

      <ControlPanel
        setWireframe={setWireframe}
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
      <MovementControls 
        setPosition={setPosition}
        setRotation={setRotation}
      />
    </div>
  );
};

export default ModelRenderer;
