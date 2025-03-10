"use client";

import { FiGrid, FiCircle, FiCamera, FiMove, FiSettings } from "react-icons/fi";
import { MdOutlineFormatColorFill, MdOutlineWallpaper } from "react-icons/md";
import { BsSun, BsLightbulb } from "react-icons/bs";
import { useState } from "react";
import { AiOutlineExpand } from "react-icons/ai"; // ✅ New resize icon


interface ControlPanelProps {
  setWireframe: (value: (prev: boolean) => boolean | boolean) => void;
  setShowGrid: (value: (prev: boolean) => boolean | boolean) => void;
  setShowAxes: (value: (prev: boolean) => boolean | boolean) => void;
  setColor: (value: string) => void;
  setBgColor: (value: string) => void;
  setAmbientIntensity: (value: number) => void;
  setDirectionalIntensity: (value: number) => void;
  color: string;
  bgColor: string;
  ambientIntensity: number;
  directionalIntensity: number;
  scale: number;
  setScale: (value: number) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  setWireframe,
  setShowGrid,
  setShowAxes,
  setColor,
  setBgColor,
  setAmbientIntensity,
  setDirectionalIntensity,
  setScale,
  color,
  bgColor,
  ambientIntensity,
  directionalIntensity,
  scale,
}) => {
  const [showControls, setShowControls] = useState(false);

  const takeScreenshot = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "3D_Model_Screenshot.png";
    link.click();
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-2">
      <div
        className={` shadow-fuchsia-300 text-black shadow-lg rounded-3xl backdrop-blur-md transition-all duration-300 p-4 flex flex-col space-y-4 ${
          showControls ? "scale-100 opacity-100 w-64" : "scale-0 opacity-0 w-0"
        }`}
      >
        <button
          onClick={() => setWireframe((prev) => !prev)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-500 transition-all duration-300 text-white font-semibold rounded-lg shadow-md"
        >
          <FiGrid size={18} /> <span>Toggle Wireframe</span>
        </button>

        <button
          onClick={() => setShowGrid((prev) => !prev)}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 transition-all duration-300 text-white font-semibold rounded-lg shadow-md"
        >
          <FiCircle size={18} /> <span>Toggle Grid</span>
        </button>

        <button
          onClick={() => setShowAxes((prev) => !prev)}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-500 transition-all duration-300 text-white font-semibold rounded-lg shadow-md"
        >
          <FiMove size={18} /> <span>Toggle Axis</span>
        </button>

        {/* Color Pickers */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-3">
            <MdOutlineFormatColorFill size={20} className="text-white" />
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer"
            />
          </div>
          <div className="flex items-center space-x-3">
            <MdOutlineWallpaper size={20} className="text-white" />
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Ambient Light Intensity Control */}
        <div className="flex items-center space-x-3">
          <BsSun size={20} className="text-yellow-400" />
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={ambientIntensity}
            onChange={(e) => setAmbientIntensity(parseFloat(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>

        {/* Directional Light Intensity Control */}
        <div className="flex items-center space-x-3">
          <BsLightbulb size={20} className="text-blue-400" />
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={directionalIntensity}
            onChange={(e) => setDirectionalIntensity(parseFloat(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>

        <div className="flex items-center space-x-3">
          <AiOutlineExpand size={20} className="text-white" />
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>

        {/* Screenshot Button */}
        <button
          onClick={takeScreenshot}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 transition-all duration-300 text-white font-semibold rounded-lg shadow-md"
        >
          <FiCamera size={18} /> <span>Screenshot</span>
        </button>
      </div>

      {/* Floating Button to Expand Controls */}
      <button
        onClick={() => setShowControls((prev) => !prev)}
        className="w-14 h-14 flex items-center justify-center bg-fuchsia-100 hover:bg-fuchsia-200 text-black shadow-lg rounded-full cursor-pointer transition-all duration-800"
      >
        <FiSettings size={26} />
      </button>
    </div>
  );
};

export default ControlPanel;
