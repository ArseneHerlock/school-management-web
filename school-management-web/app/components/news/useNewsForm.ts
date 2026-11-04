"use client";

import { useState, useEffect, useRef } from "react";
import { uploadMedia, getMediaUrl } from "@/services/media";
import { NewsItemData } from "./NewsDetailModal";
import { extractPdfUrl } from "./newsHelper";

export function useNewsForm({
  isOpen,
  initialData,
  onSave,
  onClose,
}: {
  isOpen: boolean;
  initialData?: NewsItemData | null;
  onSave: (data: Partial<NewsItemData>) => Promise<void>;
  onClose: () => void;
}) {
  const [tieuDe, setTieuDe] = useState("");
  const [tomTat, setTomTat] = useState("");
  const [hinhAnh, setHinhAnh] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfFileName, setPdfFileName] = useState("");
  const [pdfFileSize, setPdfFileSize] = useState("");
  const [phamVi, setPhamVi] = useState<number>(0);
  const [loaiTin, setLoaiTin] = useState<"NEWS" | "EVENT">("NEWS");

  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setTieuDe(initialData.tieuDe || "");
      setTomTat(initialData.tomTat || "");
      setHinhAnh(initialData.imageUrl || initialData.hinhAnh || "");
      setPhamVi(initialData.phamVi ?? 0);
      setLoaiTin(initialData.loaiTin || "NEWS");

      const content = initialData.noiDung || "";
      const cleanPdf =
        extractPdfUrl(content) || extractPdfUrl(initialData.tomTat);
      if (cleanPdf) {
        setPdfUrl(cleanPdf);
        setPdfFileName(
          initialData.tomTat?.replace(/^Tài liệu:\s*/i, "") ||
            "Tài liệu tin tức PDF"
        );
      } else {
        setPdfUrl("");
        setPdfFileName("");
      }
      setPdfFileSize("");
    } else {
      setTieuDe("");
      setTomTat("");
      setHinhAnh("");
      setPdfUrl("");
      setPdfFileName("");
      setPdfFileSize("");
      setPhamVi(0);
      setLoaiTin("NEWS");
    }
    setError("");
  }, [initialData, isOpen]);

  const handlePdfChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Vui lòng chọn đúng tệp định dạng PDF (.pdf)");
      return;
    }

    setUploadingPdf(true);
    setError("");

    try {
      const cleanName = file.name
        .replace(/\.pdf$/i, "")
        .replace(/[_-]+/g, " ")
        .trim();
      if (!tieuDe || tieuDe === "Bản tin mới") {
        setTieuDe(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }

      setPdfFileName(file.name);
      setPdfFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
      setTomTat(`Tài liệu: ${file.name}`);

      let finalUrl = "";
      try {
        const res = await uploadMedia(file);
        finalUrl = getMediaUrl(res.url || res.id || res.fileUrl);
      } catch (uploadErr) {
        console.warn(
          "Backend Media upload failed, reading file as data URL:",
          uploadErr
        );
        finalUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      setPdfUrl(finalUrl);
    } catch (err: any) {
      setError(err?.message || "Không thể tải file PDF lên.");
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WEBP)");
      return;
    }

    setUploadingImage(true);
    setError("");

    try {
      let finalImgUrl = "";
      try {
        const res = await uploadMedia(file);
        finalImgUrl = getMediaUrl(res.url || res.id || res.fileUrl);
      } catch (uploadErr) {
        console.warn(
          "Backend Image upload failed, reading as data URL:",
          uploadErr
        );
        finalImgUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }
      setHinhAnh(finalImgUrl);
    } catch (err: any) {
      setError(err?.message || "Không thể tải ảnh đại diện lên.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = Boolean(initialData?.id);

    if (!isEditing && !pdfUrl && !tomTat.trim()) {
      setError(
        "Vui lòng tải lên file tài liệu PDF hoặc nhập nội dung tóm tắt cho tin tức."
      );
      return;
    }
    if (!tieuDe.trim()) {
      setError("Vui lòng nhập tiêu đề cho tin tức.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const resolvedTomTat =
        tomTat.trim() ||
        (pdfFileName
          ? `Tài liệu: ${pdfFileName}`
          : initialData?.tomTat || "Thông báo chính thức từ nhà trường");

      const resolvedNoiDung = pdfUrl || initialData?.noiDung || resolvedTomTat;

      await onSave({
        id: initialData?.id,
        tieuDe: tieuDe.trim(),
        noiDung: resolvedNoiDung,
        tomTat: resolvedTomTat,
        hinhAnh: hinhAnh || undefined,
        imageUrl: hinhAnh || undefined,
        phamVi,
        loaiTin,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || "Không thể lưu tin tức vào hệ thống.");
    } finally {
      setSaving(false);
    }
  };

  return {
    tieuDe,
    setTieuDe,
    tomTat,
    setTomTat,
    hinhAnh,
    setHinhAnh,
    pdfUrl,
    setPdfUrl,
    pdfFileName,
    setPdfFileName,
    pdfFileSize,
    setPdfFileSize,
    phamVi,
    setPhamVi,
    loaiTin,
    setLoaiTin,
    uploadingPdf,
    uploadingImage,
    saving,
    error,
    pdfInputRef,
    imageInputRef,
    handlePdfChange,
    handleImageChange,
    handleSubmit,
  };
}
