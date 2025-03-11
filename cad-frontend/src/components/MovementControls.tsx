"use client";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IoArrowDown, IoArrowUp } from "react-icons/io5";
import { BiRotateLeft, BiRotateRight } from "react-icons/bi";
import { TbRotate360 } from "react-icons/tb";

interface MovementControlsProps {
  setPosition: (callback: (prev: { x: number; y: number; z: number }) => { x: number; y: number; z: number }) => void;
  setRotation: (callback: (prev: { x: number; y: number; z: number }) => { x: number; y: number; z: number }) => void;
}

const MovementControls: React.FC<MovementControlsProps> = ({ setPosition, setRotation }) => {
  const movementStep = 0.5;
  const rotationStep = 10; // Rotate by 10 degrees

  return (
    <div className="fixed top-30 left-6 flex flex-col space-y-2">
      {/* Movement Controls */}
      <button
        onClick={() => setPosition((p) => ({ ...p, x: p.x - movementStep }))}
        className="px-3 py-2 cursor-pointer bg-fuchsia-300 hover:bg-fuchsia-400 text-black transition-all duration-300 rounded-lg shadow-md"
      >
        <FaArrowLeft />
      </button>
      <button
        onClick={() => setPosition((p) => ({ ...p, x: p.x + movementStep }))}
        className="px-3 py-2 cursor-pointer bg-fuchsia-300 hover:bg-fuchsia-400 text-black transition-all duration-300 rounded-lg shadow-md"
      >
        <FaArrowRight />
      </button>
      <button
        onClick={() => setPosition((p) => ({ ...p, y: p.y + movementStep }))}
        className="px-3 py-2 cursor-pointer bg-fuchsia-300 hover:bg-fuchsia-400 text-black transition-all duration-300 rounded-lg shadow-md"
      >
        <IoArrowUp />
      </button>
      <button
        onClick={() => setPosition((p) => ({ ...p, y: p.y - movementStep }))}
        className="px-3 py-2 cursor-pointer bg-fuchsia-300 hover:bg-fuchsia-400 text-black transition-all duration-300 rounded-lg shadow-md"
      >
        <IoArrowDown />
      </button>
      <button
        onClick={() => setPosition((p) => ({ ...p, z: p.z - movementStep }))}
        className="px-3 py-2 cursor-pointer bg-fuchsia-300 hover:bg-fuchsia-400 transition-all duration-300 text-black rounded-lg shadow-md"
      >
        ⬅
      </button>
      <button
        onClick={() => setPosition((p) => ({ ...p, z: p.z + movementStep }))}
        className="px-3 py-2 cursor-pointer bg-fuchsia-300 hover:bg-fuchsia-400 text-black transition-all duration-300 rounded-lg shadow-md"
      >
        ➡
      </button>

      {/* Rotation Controls */}
      <button
        onClick={() => setRotation((r) => ({ ...r, y: r.y - rotationStep }))}
        className="px-3 py-2 cursor-pointer bg-blue-300 hover:bg-blue-400 text-black transition-all duration-300 rounded-lg shadow-md"
      >
        <BiRotateRight />
      </button>
      <button
        onClick={() => setRotation((r) => ({ ...r, y: r.y + rotationStep }))}
        className="px-3 py-2 cursor-pointer bg-blue-300 hover:bg-blue-400 text-black transition-all duration-300 rounded-lg shadow-md"
      >
        <BiRotateLeft />
      </button>
      <button
        onClick={() => setRotation((r) => ({ ...r, x: r.x + rotationStep }))}
        className="px-3 py-2 cursor-pointer bg-green-300 hover:bg-green-400 text-black transition-all duration-300 rounded-lg shadow-md"
      >
        X
      </button>
      <button
        onClick={() => setRotation((r) => ({ ...r, z: r.z + rotationStep }))}
        className="px-3 py-2 cursor-pointer bg-yellow-300 hover:bg-yellow-400 text-black transition-all duration-300 rounded-lg shadow-md"
      >
        Z
      </button>
      <button
        onClick={() => setRotation(() => ({ x: 0, y: 0, z: 0 }))}
        className="px-3 py-2 cursor-pointer bg-red-300 hover:bg-red-400 text-black transition-all duration-300 rounded-lg shadow-md"
      >
        <TbRotate360 />
      </button>
    </div>
  );
};

export default MovementControls;