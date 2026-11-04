"use client";

import React, { RefObject } from "react";
import { Image as ImageIcon, Loader2, X } from "lucide-react";
import { getFullApiUrl } from "@/services/client";

interface ImageUploadFieldProps {
  hinhAnh: string;
  uploadingImage: boolean;
  imageInputRef: RefObject<HTMLInputElement | null>;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearImage: () => void;
}

export default function ImageUploadField({
  hinhAnh,
  uploadingImage,
  imageInputRef,
  onImageChange,
  onClearImage,
}: ImageUploadFieldProps) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
        2. Ảnh đại diện cho tin tức (Thumbnail)
      </label>
      <input
        type="file"
        ref={imageInputRef}
        accept="image/*"
        onChange={onImageChange}
        className="hidden"
      />

      {!hinhAnh ? (
        <div
          onClick={() => imageInputRef.current?.click()}
          className="border-2 border-dashed border-sky-200 hover:border-sky-400 bg-sky-50/40 hover:bg-sky-50/70 rounded-2xl p-4 text-center cursor-pointer transition flex items-center justify-center gap-3 group"
        >
          <div className="h-10 w-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center group-hover:scale-105 transition">
            {uploadingImage ? (
              <Loader2 size={20} className="animate-spin text-sky-600" />
            ) : (
              <ImageIcon size={20} />
            )}
          </div>
          <div className="text-left text-xs">
            <p className="font-bold text-slate-800">
              {uploadingImage ? "Đang tải ảnh..." : "Chọn ảnh đại diện bài viết"}
            </p>
            <p className="text-slate-400 text-[11px]">Định dạng JPG, PNG, WEBP</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="relative inline-block rounded-xl overflow-hidden border border-slate-200 shadow-2xs group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getFullApiUrl(hinhAnh)}
              alt="Ảnh đại diện tin tức"
              className="h-24 w-40 object-cover"
            />
            <button
              type="button"
              onClick={onClearImage}
              className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-1 hover:bg-black transition cursor-pointer"
              title="Xóa ảnh đại diện"
            >
              <X size={13} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Đổi ảnh khác
          </button>
        </div>
      )}
    </div>
  );
}
export { ImageUploadField };
