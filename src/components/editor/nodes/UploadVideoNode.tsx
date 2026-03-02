"use client";

import { Handle, Position, type NodeProps, useReactFlow } from "reactflow";
import { Video, Upload, X, Loader2 } from "lucide-react";
import clsx from "clsx";
import { useCallback, useRef, useState } from "react";

export default function UploadVideoNode({ id, data, selected }: NodeProps) {
  const { setNodes } = useReactFlow();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setNotice(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();

      if (!result.success) {
        setNotice(result.error || 'Upload failed');
        return;
      }

      setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  videoUrl: result.url,
                  fileName: file.name,
                },
              }
            : node
        )
      );

      setNotice("Video added");
    } catch (err) {
      console.error('Upload error:', err);
      setNotice('Upload failed');
    } finally {
      setIsProcessing(false);
    }
  }, [id, setNodes]);

  const removeVideo = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                videoUrl: undefined,
                fileName: undefined,
              },
            }
          : node
      )
    );
    setNotice("Video removed");
  }, [id, setNodes]);

  return (
    <div
      className={clsx(
        "relative w-[300px] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.6)]",
        selected ? "bg-[#2B2B2F]" : "bg-[#212126]"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 text-[14px]">
        <Video size={14} className="text-purple-400" />
        Upload Video
        <div className="ml-auto text-xs text-white/60">
          {isProcessing ? "Processing…" : notice ?? ""}
        </div>
      </div>

      {/* Body */}
      <div className="p-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/webm,video/x-m4v"
          onChange={handleFileUpload}
          className="hidden"
        />

        {data?.videoUrl ? (
          <div className="relative rounded-lg overflow-hidden bg-black">
            <video
              src={data.videoUrl}
              className="w-full max-h-[150px] object-contain"
              controls
              muted
            />
            <button
              onClick={removeVideo}
              className="absolute top-2 right-2 bg-black/60 rounded-full p-1 hover:bg-red-500/80"
            >
              <X size={14} />
            </button>
            {data.fileName && (
              <p className="text-[10px] text-white/60 mt-1 truncate px-1">
                {data.fileName}
              </p>
            )}
          </div>
        ) : (
          <label
            className="
              nodrag
              h-[120px]
              rounded-xl
              bg-[#353539]
              flex flex-col items-center justify-center
              cursor-pointer
              border-2 border-dashed border-white/10
              hover:border-purple-500/30
            "
          >
            {isProcessing ? (
              <>
                <Loader2 size={24} className="text-purple-400 mb-2 animate-spin" />
                <span className="text-xs text-purple-400">Uploading…</span>
              </>
            ) : (
              <>
                <Upload size={24} className="text-white/40 mb-2" />
                <span className="text-xs text-white/40">Click to upload video</span>
                <span className="text-[10px] text-white/30 mt-1">MP4, MOV, WebM, M4V</span>
              </>
            )}
            <input
              type="file"
              accept="video/mp4,video/quicktime,video/webm,video/x-m4v"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isProcessing}
            />
          </label>
        )}
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!w-3 !h-3 !bg-purple-500 !border-purple-400"
      />
    </div>
  );
}
