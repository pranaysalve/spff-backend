"use client";

import {
  AudioWaveform,
  File,
  FileImage,
  FolderArchive,
  UploadCloud,
  Video,
  X,
} from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { ScrollArea } from "./ui/scroll-area";
import { supabase } from "@/lib/supabaseClient";

export default function ImageUpload({ onUploadComplete }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [uploading, setUploading] = useState(false);

  const getFileIconAndColor = (file) => {
    if (file.type.includes("image"))
      return {
        icon: <FileImage size={40} className="fill-purple-600" />,
        color: "bg-purple-600",
      };
    if (file.type.includes("pdf"))
      return {
        icon: <File size={40} className="fill-blue-400" />,
        color: "bg-blue-400",
      };
    if (file.type.includes("audio"))
      return {
        icon: <AudioWaveform size={40} className="fill-yellow-400" />,
        color: "bg-yellow-400",
      };
    if (file.type.includes("video"))
      return {
        icon: <Video size={40} className="fill-green-400" />,
        color: "bg-green-400",
      };
    return {
      icon: <FolderArchive size={40} className="fill-gray-400" />,
      color: "bg-gray-400",
    };
  };

  const uploadToSupabase = async (file) => {
    try {
      setUploading(true);
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}.${ext}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("logos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      console.log({ uploadError });
      if (uploadError) throw uploadError;
      const { data, e } = supabase.storage.from("logos").getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      setUploadedFiles((prev) => [...prev, { file, url: publicUrl }]);
      onUploadComplete?.(publicUrl); // ✅ pass URL to parent form
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed, please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (file) => {
    setFilesToUpload((prev) => prev.filter((item) => item.File !== file));
    setUploadedFiles((prev) => prev.filter((item) => item.file !== file));
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) => ({
      progress: 0,
      File: file,
    }));
    setFilesToUpload((prev) => [...prev, ...newFiles]);

    for (const file of acceptedFiles) {
      await uploadToSupabase(file);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      {/* Dropzone area */}
      <div>
        <label
          {...getRootProps()}
          className="relative flex flex-col items-center justify-center w-full py-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div className="text-center">
            <div className="border p-2 rounded-md max-w-min mx-auto">
              <UploadCloud size={20} />
            </div>
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold">Drag files</span> or click to
              upload
            </p>
            <p className="text-xs text-gray-500">Images under 10 MB</p>
          </div>
        </label>

        <Input
          {...getInputProps()}
          id="dropzone-file"
          accept="image/png, image/jpeg"
          type="file"
          className="hidden"
        />
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div>
          <p className="font-medium my-2 mt-6 text-muted-foreground text-sm">
            Uploaded Files
          </p>
          <div className="space-y-2 pr-3">
            {uploadedFiles.map(({ file, url }) => (
              <div
                key={file.lastModified}
                className="flex justify-between gap-2 rounded-lg overflow-hidden border border-slate-100 group hover:border-slate-300 transition-all"
              >
                <div className="flex items-center flex-1 p-2">
                  <div className="text-white">
                    {getFileIconAndColor(file).icon}
                  </div>
                  <div className="w-full ml-2">
                    <p className="text-sm text-muted-foreground">
                      {file.name.slice(0, 25)}
                    </p>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 underline"
                    >
                      View File
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file)}
                  className="bg-red-500 text-white transition-all items-center justify-center px-2 hidden group-hover:flex"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {uploading && (
        <p className="text-sm text-muted-foreground mt-2">Uploading...</p>
      )}
    </div>
  );
}
