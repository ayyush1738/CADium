"use client";

import { useSearchParams } from "next/navigation";
import ModelViewer from "../../components/ModelViewer";

export default function ViewModelPage() {
  const searchParams = useSearchParams();
  const modelUrl = searchParams.get("modelUrl");

  if (!modelUrl) {
    return <div className="text-center text-red-500 mt-10">No model provided.</div>;
  }

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <ModelViewer modelUrl={modelUrl} />
    </div>
  );
}
