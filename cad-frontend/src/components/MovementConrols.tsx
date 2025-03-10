"use client";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; // Font Awesome icons for left and right arrows
import { IoArrowDown, IoArrowUp } from "react-icons/io5"; // Ionicons for up and down arrows

interface MovementControlsProps {
  setPosition: (callback: (prev: { x: number; y: number; z: number }) => { x: number; y: number; z: number }) => void;
}

const MovementControls: React.FC<MovementControlsProps> = ({ setPosition }) => {
  const movementStep = 0.5;

  return (
    <div className="fixed bottom-6 left-6 flex flex-col space-y-2">
      {/* Backward Movement (Backward on X-axis) */}
      <button
        onClick={() => setPosition((p) => ({ ...p, x: p.x - movementStep }))}
        className="px-3 py-2 bg-indigo-700 hover:bg-indigo-600 transition-all duration-300 text-white rounded-lg shadow-md"
      >
        <FaArrowLeft />
      </button>
      {/* Forward Movement (Forward on X-axis) */}
      <button
        onClick={() => setPosition((p) => ({ ...p, x: p.x + movementStep }))}
        className="px-3 py-2 bg-indigo-700 hover:bg-indigo-600 transition-all duration-300 text-white rounded-lg shadow-md"
      >
        <FaArrowRight />
      </button>
      {/* Move Down (on Y-axis) */}
      <button
        onClick={() => setPosition((p) => ({ ...p, y: p.y - movementStep }))}
        className="px-3 py-2 bg-indigo-700 hover:bg-indigo-600 transition-all duration-300 text-white rounded-lg shadow-md"
      >
        <IoArrowDown />
      </button>
      {/* Move Up (on Y-axis) */}
      <button
        onClick={() => setPosition((p) => ({ ...p, y: p.y + movementStep }))}
        className="px-3 py-2 bg-indigo-700 hover:bg-indigo-600 transition-all duration-300 text-white rounded-lg shadow-md"
      >
        <IoArrowUp />
      </button>
      {/* Move Backward (on Z-axis) */}
      <button
        onClick={() => setPosition((p) => ({ ...p, z: p.z - movementStep }))}
        className="px-3 py-2 bg-indigo-700 hover:bg-indigo-600 transition-all duration-300 text-white rounded-lg shadow-md"
      >
        ⬅
      </button>
      {/* Move Forward (on Z-axis) */}
      <button
        onClick={() => setPosition((p) => ({ ...p, z: p.z + movementStep }))}
        className="px-3 py-2 bg-indigo-700 hover:bg-indigo-600 transition-all duration-300 text-white rounded-lg shadow-md"
      >
        ➡
      </button>
    </div>
  );
};

export default MovementControls;
