"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import FolderUiComponent from "./FolderUiComponent";

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
      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { filename } = response.data;
      const modelUrl = `http://127.0.0.1:5000/models/${filename}`;

      // Navigate to the Model Viewer page
      router.push(`/model-viewer?modelUrl=${encodeURIComponent(modelUrl)}`);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center text-center justify-center space-y-4">
      
      <h2 className="mb-20">Click The Folder Below To <br/> upload Your 3D File (.OBJ / .STL)</h2>

      <label className="relative group flex flex-col items-center justify-center cursor-pointer">
        <input type="file" onChange={handleFileChange} className="border p-2 rounded absolute mt-70 w-60 h-30 mb-70 shadow-2xl shadow-fuchsia-300 border-none" />
        {/* Uiverse.io Folder Selection UI */}
        <FolderUiComponent />
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
