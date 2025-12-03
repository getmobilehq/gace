import React, { useState, useCallback } from "react";
import { Upload, File, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DocumentUploaderProps {
  onUploadComplete?: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[];
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "processing" | "completed" | "error";
  progress: number;
  url?: string;
  error?: string;
  extractedData?: Record<string, any>;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onUploadComplete,
  maxFiles = 10,
  maxSizeMB = 50,
  acceptedTypes = [".pdf", ".png", ".jpg", ".jpeg", ".doc", ".docx"],
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = useCallback(
    async (fileList: FileList) => {
      const newFiles: UploadedFile[] = [];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];

        // Validate file size
        if (file.size > maxSizeMB * 1024 * 1024) {
          alert(`File ${file.name} exceeds ${maxSizeMB}MB limit`);
          continue;
        }

        // Validate file type
        const fileExt = "." + file.name.split(".").pop()?.toLowerCase();
        if (!acceptedTypes.includes(fileExt)) {
          alert(`File type ${fileExt} not accepted`);
          continue;
        }

        const uploadedFile: UploadedFile = {
          id: `${Date.now()}-${i}`,
          name: file.name,
          size: file.size,
          type: file.type,
          status: "uploading",
          progress: 0,
        };

        newFiles.push(uploadedFile);
      }

      setFiles((prev) => [...prev, ...newFiles]);

      // Simulate upload and processing
      for (const uploadedFile of newFiles) {
        await simulateUpload(uploadedFile, setFiles);
      }

      if (onUploadComplete) {
        onUploadComplete(newFiles);
      }
    },
    [maxSizeMB, acceptedTypes, onUploadComplete]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFiles = e.dataTransfer.files;
      if (files.length + droppedFiles.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }

      processFiles(droppedFiles);
    },
    [files.length, maxFiles, processFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (!selectedFiles) return;

      if (files.length + selectedFiles.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }

      processFiles(selectedFiles);
      e.target.value = ""; // Reset input
    },
    [files.length, maxFiles, processFiles]
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <motion.div
        className={`glass relative overflow-hidden rounded-xl border-2 border-dashed p-8 text-center transition-all ${
          isDragging
            ? "glow-cyan border-cyan-400 bg-cyan-500/10"
            : "border-indigo-500/30 hover:border-indigo-500/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <input
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={handleFileInput}
          className="absolute inset-0 cursor-pointer opacity-0"
          id="file-upload"
        />

        <motion.div
          animate={{ y: isDragging ? -5 : 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Upload
            className={`mx-auto mb-4 h-12 w-12 transition-colors ${
              isDragging ? "text-cyan-400" : "text-indigo-400"
            }`}
          />
          <h3 className="mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text font-semibold text-transparent">
            Drop documents here or click to browse
          </h3>
          <p className="text-xs text-slate-400">
            Supports {acceptedTypes.join(", ")} up to {maxSizeMB}MB each
          </p>
          <p className="mt-1 text-[10px] text-slate-500">
            Maximum {maxFiles} files
          </p>
        </motion.div>
      </motion.div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-cyan-300">
                Uploaded Files ({files.length})
              </h4>
              {files.every((f) => f.status === "completed") && (
                <CheckCircle className="h-4 w-4 text-green-400" />
              )}
            </div>

            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass flex items-center gap-3 rounded-lg border border-indigo-500/30 p-3"
              >
                <div className="flex-shrink-0">
                  {file.status === "uploading" || file.status === "processing" ? (
                    <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
                  ) : file.status === "completed" ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-xs font-semibold text-slate-200">
                      {file.name}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>

                  {/* Progress Bar */}
                  {(file.status === "uploading" || file.status === "processing") && (
                    <div className="mt-1">
                      <div className="h-1 overflow-hidden rounded-full bg-slate-700">
                        <motion.div
                          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${file.progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className="mt-0.5 text-[10px] text-slate-400">
                        {file.status === "uploading"
                          ? `Uploading... ${file.progress}%`
                          : "Processing with OCR..."}
                      </p>
                    </div>
                  )}

                  {file.status === "completed" && file.extractedData && (
                    <p className="mt-1 text-[10px] text-green-400">
                      ✓ Data extracted successfully
                    </p>
                  )}

                  {file.status === "error" && (
                    <p className="mt-1 text-[10px] text-red-400">
                      {file.error || "Upload failed"}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => removeFile(file.id)}
                  className="flex-shrink-0 rounded-lg p-1 transition-colors hover:bg-red-500/20"
                >
                  <X className="h-4 w-4 text-slate-400 hover:text-red-400" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Simulate file upload and OCR processing
 * In production, this would call actual storage and OCR services
 */
async function simulateUpload(
  file: UploadedFile,
  setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>
) {
  // Simulate upload progress
  for (let progress = 0; progress <= 100; progress += 20) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    setFiles((prev) =>
      prev.map((f) =>
        f.id === file.id ? { ...f, progress, status: "uploading" } : f
      )
    );
  }

  // Simulate OCR processing
  setFiles((prev) =>
    prev.map((f) =>
      f.id === file.id ? { ...f, status: "processing", progress: 100 } : f
    )
  );

  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simulate completion with extracted data
  const mockExtractedData = {
    documentType: "Bank Statement",
    date: "2025-01-15",
    amount: "£15,430.50",
    currency: "GBP",
    accountNumber: "****1234",
  };

  setFiles((prev) =>
    prev.map((f) =>
      f.id === file.id
        ? {
            ...f,
            status: "completed",
            extractedData: mockExtractedData,
            url: `https://example.com/documents/${file.id}`,
          }
        : f
    )
  );
}
