import React from 'react';
import { Upload, Image as ImageIcon, Video, X } from 'lucide-react';
import { SelectedFilePreview } from './types';

interface FileUploadSectionProps {
  files: SelectedFilePreview[];
  isUploading: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;
}

export function FileUploadSection({
  files,
  isUploading,
  handleFileChange,
  removeFile,
}: FileUploadSectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="font-black text-slate-800 flex items-center gap-1.5 text-xs">
          <ImageIcon size={14} className="text-orange-500" />
          Ảnh hoặc Video khoảnh khắc
        </label>
        <span className="text-[11px] text-slate-400">
          Đã chọn: <b>{files.length}</b> tệp
        </span>
      </div>

      <label className="border-2 border-dashed border-orange-200 hover:border-orange-400 bg-orange-50/30 hover:bg-orange-50/60 rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition">
        <div className="h-10 w-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-2 shadow-xs">
          <Upload size={20} />
        </div>
        <p className="font-black text-slate-800 text-xs">
          Nhấn để tải lên ảnh hoặc video của bé
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Hỗ trợ chọn nhiều ảnh JPG, PNG, GIF hoặc video MP4
        </p>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />
      </label>

      {files.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 pt-2">
          {files.map((item, idx) => (
            <div
              key={idx}
              className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-100"
            >
              {item.type === 'video' ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white p-1">
                  <Video size={24} className="text-amber-400 mb-1" />
                  <span className="text-[9px] truncate w-full text-center px-1">
                    {item.name}
                  </span>
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.previewUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              )}

              <button
                type="button"
                onClick={() => removeFile(idx)}
                disabled={isUploading}
                className="absolute top-1 right-1 h-5 w-5 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-90 hover:opacity-100 transition shadow-xs cursor-pointer"
              >
                <X size={11} strokeWidth={3} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
