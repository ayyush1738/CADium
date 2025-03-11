"use client";

import { useSearchParams } from "next/navigation";
import ModelRenderer from "../../components/ModelRenderer";

export default function ViewModelPage() {
  const searchParams = useSearchParams();
  const modelUrl = searchParams.get("modelUrl");

  if (!modelUrl) {
    return <div className="text-center mt-96 text-fuchsia-400">No model uploaded</div>;
  }

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <ModelRenderer modelUrl={modelUrl} />
    </div>
  );
}
