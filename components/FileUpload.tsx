"use client";

import { useState } from "react";
import { createUploadClient } from "pushduck/client";
import type { AppUploadRouter } from "@/app/api/upload/route";
import { Button } from "./ui/button";

const upload = createUploadClient<AppUploadRouter>({
  endpoint: "/api/upload",
});

export function FileUpload() {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const { uploadFiles, files, isUploading } = upload.documentUpload({
    onSuccess(results) {
      setUploadedUrls((prev) => [
        ...prev,
        ...results.map((r) => r.url).filter((url): url is string => !!url),
      ]);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (selected && selected.length > 0) {
      uploadFiles(Array.from(selected));
    }
    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 cursor-pointer hover:border-sky-500 dark:hover:border-sky-400 transition-colors">
        <svg
          className="w-8 h-8 mb-2 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {isUploading ? "Uploading…" : "Click to upload PDF, Word, or text files"}
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          PDF, DOC, DOCX, TXT, MD — up to 16 MB
        </span>
        <input
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.md"
          multiple
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </label>

      {files.length > 0 && (
        <ul className="flex flex-col gap-2">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex items-center justify-between rounded bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm"
            >
              <span className="truncate max-w-[60%] text-gray-700 dark:text-gray-200">
                {file.name}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500 capitalize">
                {file.status === "uploading" ? `${file.progress}%` : file.status}
              </span>
            </li>
          ))}
        </ul>
      )}

      {uploadedUrls.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Uploaded files — copy a URL to ingest it:
          </p>
          <ul className="flex flex-col gap-2">
            {uploadedUrls.map((url) => (
              <li
                key={url}
                className="flex items-center gap-2 rounded bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs"
              >
                <span className="truncate flex-1 text-sky-600 dark:text-sky-400">
                  {url}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0 h-7 text-xs px-2"
                  onClick={() => navigator.clipboard.writeText(url)}
                >
                  Copy
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
