"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface FilePreviewProps {
  file: File;
}

export default function FilePreview({ file }: FilePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url); 
  }, [file]);

  if (!previewUrl) return null;

  return (
    <div className="w-40 h-40 relative">
      <Image
        src={previewUrl}
        alt="preview"
        fill
        className="object-cover rounded-lg shadow"
      />
    </div>
  );
}