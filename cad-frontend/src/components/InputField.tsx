"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const InputField: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { filename } = response.data;
      const modelUrl = `http://localhost:5000/models/${filename}`;

      // Navigate to the Model Viewer page
      router.push(`/model-viewer?modelUrl=${encodeURIComponent(modelUrl)}`);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center text-center justify-center space-y-4">
      {/* Uiverse.io Folder Selection UI */}
      <h2 className="mb-20">Click The Folder Below To <br/> upload Your 3D File (.OBJ / .STL)</h2>

      <label className="relative group flex flex-col items-center justify-center cursor-pointer">
        <input type="file" onChange={handleFileChange} className="border p-2 rounded absolute mt-70 w-60 h-30 mb-70 shadow-2xl shadow-fuchsia-300 border-none" />

        <div className="file relative w-60 h-40 origin-bottom [perspective:1500px] z-50">
          <div className="work-5 bg-amber-600 w-full h-full origin-top rounded-2xl rounded-tl-none 
            group-hover:shadow-[0_20px_40px_rgba(0,0,0,.2)] transition-all ease duration-300 relative 
            after:absolute after:content-[''] after:bottom-[99%] after:left-0 after:w-20 after:h-4 
            after:bg-amber-600 after:rounded-t-2xl 
            before:absolute before:content-[''] before:-top-[15px] before:left-[75.5px] before:w-4 
            before:h-4 before:bg-amber-600 before:[clip-path:polygon(0_35%,0%_100%,50%_100%);]"
          ></div>

          <div className="work-4 absolute inset-1 bg-zinc-400 rounded-2xl transition-all ease duration-300 origin-bottom select-none group-hover:[transform:rotateX(-20deg)]"></div>
          <div className="work-3 absolute inset-1 bg-zinc-300 rounded-2xl transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-30deg)]"></div>
          <div className="work-2 absolute inset-1 bg-zinc-200 rounded-2xl transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-38deg)]"></div>
          <div className="work-1 absolute bottom-0 bg-gradient-to-t from-amber-500 to-amber-400 w-full h-[156px] 
            rounded-2xl rounded-tr-none after:absolute after:content-[''] after:bottom-[99%] after:right-0 
            after:w-[146px] after:h-[16px] after:bg-amber-400 after:rounded-t-2xl 
            before:absolute before:content-[''] before:-top-[10px] before:right-[142px] before:size-3 
            before:bg-amber-400 before:[clip-path:polygon(100%_14%,50%_100%,100%_100%);] 
            transition-all ease duration-300 origin-bottom flex items-end 
            group-hover:shadow-[inset_0_20px_40px_#fbbf24,_inset_0_-20px_40px_#d97706] 
            group-hover:[transform:rotateX(-46deg)_translateY(1px)]"
          ></div>
        </div>
      </label>

      {selectedFile && (
        <button
          onClick={handleUpload}
          className="mt-4 bg-fuchsia-300 text-gray-900 py-2 px-4 rounded-4xl cursor-pointer hover:bg-fuchsia-200"
        >
          Upload Folder
        </button>
      )}
    </div>
  );
};

export default InputField;
