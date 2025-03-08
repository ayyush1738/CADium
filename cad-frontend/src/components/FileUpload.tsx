"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const FileUpload: React.FC = () => {
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
    <div className="flex flex-col space-y-3">
      <input type="file" onChange={handleFileChange} className="border p-2 rounded" />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Upload & View Model
      </button>
    </div>
  );
};

export default FileUpload;
