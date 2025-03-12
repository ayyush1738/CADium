"use client";
//Input your file 
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import FolderUiComponent from "./FolderUiComponent";

const InputField: React.FC=() => {
  const [selectedFile,setSelectedFile] =useState<File | null>(null);
  const [loading,setLoading] =useState(false);
  const router =useRouter();

  const handleFileChange =(event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files){
      setSelectedFile(event.target.files[0]);}
  };

  const handleUpload=async()=>{
    if(!selectedFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("http://127.0.0.1:5000/upload",formData, {
        headers: { "Content-Type": "multipart/form-data"},
      });

      const { filename } = response.data;
      const modelUrl= `http://127.0.0.1:5000/models/${filename}`;

      router.push(`/model-viewer?modelUrl=${encodeURIComponent(modelUrl)}`);
    } catch (error) {
      console.error("Upload failed:", error);
      setLoading(false); 
    }
  };

  return (
    <div className="flex flex-col items-center text-center justify-center space-y-4">
      <h2 className="mb-20">
        Click The Folder Below To <br /> Upload Your 3D File (.OBJ / .STL)
      </h2>
      <label className="relative group flex flex-col items-center justify-center cursor-pointer">
        <input
          type="file"
          onChange={handleFileChange}
          className="border p-2 rounded absolute mt-70 w-60 h-30 mb-70 shadow-2xl shadow-fuchsia-300 border-none" />
        <FolderUiComponent />
      </label>
      {loading &&(
        <div className="absolute z-90 inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 flex-col">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <section className="text-2xl font-bold mt-4">Loading...</section>
        </div>
      )}
      {selectedFile && !loading && (
        <button
          onClick={handleUpload}
          className="mt-4 bg-fuchsia-300 text-gray-900 py-2 px-4 rounded-4xl cursor-pointer hover:bg-fuchsia-200"
          disabled={loading}
        >
          Upload Folder
        </button>
      )}
    </div>
  );
};

export default InputField;
