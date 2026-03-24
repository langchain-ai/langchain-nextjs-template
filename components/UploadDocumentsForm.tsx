"use client";

import { useState, type FormEvent, useRef } from "react";
import DEFAULT_RETRIEVAL_TEXT from "@/data/DefaultRetrievalText";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { FileUp, X, Loader2 } from "lucide-react";

export function UploadDocumentsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [document, setDocument] = useState(DEFAULT_RETRIEVAL_TEXT);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ingest = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      } else if (document.trim()) {
        formData.append("text", document);
      } else {
        throw new Error("Vui lòng chọn file hoặc nhập nội dung văn bản.");
      }

      const response = await fetch("/api/retrieval/ingest", {
        method: "POST",
        body: formData,
      });

      if (response.status === 200) {
        setDocument("Đã tải lên và xử lý tài liệu thành công!");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        const json = await response.json();
        if (json.error) {
          setDocument(`Lỗi: ${json.error}`);
        }
      }
    } catch (err: any) {
      setDocument(`Lỗi: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form onSubmit={ingest} className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-4">
      <div className="space-y-4 bg-secondary/20 p-6 rounded-lg border border-border shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <FileUp className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Nạp tài liệu thông minh</h3>
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Cách 1: Tải lên tệp tin (Excel, CSV, PDF, Word, Markdown, Text)
            </label>
            <div className="flex gap-2">
              <Input
                type="file"
                ref={fileInputRef}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                accept=".xlsx,.xls,.csv,.pdf,.docx,.md,.txt"
                className="cursor-pointer bg-background"
              />
              {file && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  onClick={clearFile}
                  title="Xóa tệp đã chọn"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground font-medium">Hoặc</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Cách 2: Dán nội dung văn bản trực tiếp
            </label>
            <Textarea
              className="grow p-4 rounded-md bg-background min-h-[300px] font-sans resize-y"
              value={document}
              onChange={(e) => setDocument(e.target.value)}
              disabled={!!file}
              placeholder={file ? "Hệ thống sẽ sử dụng file đã chọn bên trên..." : "Dán nội dung tài liệu của bạn vào đây..."}
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 text-lg font-medium transition-all"
          disabled={isLoading || (!file && (!document || document === DEFAULT_RETRIEVAL_TEXT))}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Đang xử lý dữ liệu...
            </>
          ) : (
            "Bắt đầu nạp dữ liệu"
          )}
        </Button>
      </div>

      <div className="text-xs text-muted-foreground px-2 italic">
        * Lưu ý: Sau khi nạp, AI sẽ mất vài giây để học dữ liệu của bạn trước khi có thể trả lời chính xác.
      </div>
    </form>
  );
}
