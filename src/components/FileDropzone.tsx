import React from "react";

export default function FileDropzone({ onFile }: { onFile: (f: File) => void }) {
  const handleDrop = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    if (ev.dataTransfer.files && ev.dataTransfer.files.length > 0) {
      onFile(ev.dataTransfer.files[0]);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed p-6 rounded text-center"
    >
      <p>Drag & drop a file here, or click to select</p>
      <input
        type="file"
        onChange={(e) => e.target.files && onFile(e.target.files[0])}
        className="mt-4"
      />
    </div>
  );
}
