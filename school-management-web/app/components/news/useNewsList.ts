"use client";

import { useEffect, useState, useMemo } from "react";
import { api } from "@/services";
import { getFullApiUrl } from "@/services/client";
import { NewsItemData } from "./NewsDetailModal";
import { parseNewsImageAndText, formatWithImageTag } from "./newsHelper";

export function useNewsList({ role }: { role: "admin" | "teacher" | "parent" }) {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTimeStr, setCurrentTimeStr] = useState("");

  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItemData | null>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  const isAdmin = role === "admin";

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const days = [
        "Chủ Nhật",
        "Thứ Hai",
        "Thứ Ba",
        "Thứ Tư",
        "Thứ Năm",
        "Thứ Sáu",
        "Thứ Bảy",
      ];
      const dayName = days[now.getDay()];
      const d = String(now.getDate()).padStart(2, "0");
      const m = String(now.getMonth() + 1).padStart(2, "0");
      const y = now.getFullYear();
      const time = now.toTimeString().split(" ")[0];
      setCurrentTimeStr(`${dayName}, ngày ${d}/${m}/${y} ${time} GMT+7`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const newsRes = await api
        .get<any>("news", "/api/news?trang=1&soLuongMoiTrang=100")
        .catch(() => null);

      const nItems = Array.isArray(newsRes)
        ? newsRes
        : Array.isArray(newsRes?.items)
        ? newsRes.items
        : [];

      const parsedItems = nItems.map((item: any) => {
        const fromTomTat = parseNewsImageAndText(item.tomTat);
        const fromNoiDung = parseNewsImageAndText(item.noiDung);
        let detectedImg =
          item.hinhAnh || fromTomTat.imageUrl || fromNoiDung.imageUrl || null;
        if (detectedImg && !detectedImg.includes("unsplash.com")) {
          detectedImg = getFullApiUrl(detectedImg);
        } else {
          detectedImg = null;
        }
        return {
          ...item,
          rawTomTat: item.tomTat,
          tomTat: fromTomTat.cleanText,
          noiDung: fromNoiDung.cleanText || fromTomTat.cleanText,
          hinhAnh: detectedImg,
        };
      });

      const sortedByNewest = [...parsedItems].sort(
        (a, b) =>
          new Date(b.ngayTao || b.ngayXuatBan || 0).getTime() -
          new Date(a.ngayTao || a.ngayXuatBan || 0).getTime()
      );
      const seenTitles = new Set<string>();
      const uniqueItems: any[] = [];
      for (const item of sortedByNewest) {
        const normTitle = String(item.tieuDe || "").trim().toLowerCase();
        if (normTitle && seenTitles.has(normTitle)) {
          if (isAdmin && item.id) {
            api.delete("news", `/api/news/${item.id}`).catch(() => {});
          }
          continue;
        }
        if (normTitle) seenTitles.add(normTitle);
        uniqueItems.push(item);
      }

      setNewsList(uniqueItems);
    } catch (err) {
      console.error("Error loading data from backend:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filteredNews = useMemo(() => {
    if (!searchQuery.trim()) return newsList;
    const q = searchQuery.toLowerCase().trim();
    return newsList.filter(
      (item) =>
        (item.tieuDe && item.tieuDe.toLowerCase().includes(q)) ||
        (item.tomTat && item.tomTat.toLowerCase().includes(q)) ||
        (item.noiDung && item.noiDung.toLowerCase().includes(q))
    );
  }, [newsList, searchQuery]);

  const handleViewArticle = (id: string) => {
    setSelectedArticleId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenCreate = () => {
    if (!isAdmin) return;
    setEditingItem(null);
    setFormOpen(true);
  };

  const handleOpenEdit = async (item: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAdmin) return;
    let fullItem = item;
    try {
      const detail = await api.get<any>("news", `/api/news/${item.id}`);
      if (detail && detail.id) {
        fullItem = detail;
      }
    } catch {}

    const fromTomTat = parseNewsImageAndText(
      fullItem.rawTomTat || fullItem.tomTat
    );
    const fromNoiDung = parseNewsImageAndText(fullItem.noiDung);
    let img =
      fullItem.hinhAnh ||
      item.hinhAnh ||
      fromTomTat.imageUrl ||
      fromNoiDung.imageUrl ||
      "";
    if (img && !img.includes("unsplash.com")) {
      img = getFullApiUrl(img);
    } else {
      img = "";
    }
    setEditingItem({
      id: fullItem.id || item.id,
      tieuDe: fullItem.tieuDe || item.tieuDe || "",
      tomTat: fromTomTat.cleanText,
      noiDung: fromNoiDung.cleanText || fromTomTat.cleanText,
      hinhAnh: img,
      phamVi: fullItem.phamVi ?? item.phamVi ?? 0,
      loaiTin: "NEWS",
    });
    setFormOpen(true);
  };

  const handleOpenDelete = (item: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAdmin) return;
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!isAdmin || !itemToDelete) return;
    setDeleting(true);
    try {
      await api.delete("news", `/api/news/${itemToDelete.id}`);
      if (selectedArticleId === itemToDelete.id) {
        setSelectedArticleId(null);
      }
      await loadData();
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleting(false);
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  const handleSave = async (data: Partial<NewsItemData>) => {
    if (!isAdmin) return;
    const targetId = data.id || editingItem?.id;
    const isEditing = Boolean(targetId);
    const img =
      data.hinhAnh && !data.hinhAnh.includes("unsplash.com")
        ? data.hinhAnh.trim()
        : null;

    const tomTatWithImg = formatWithImageTag(data.tomTat || "", img);
    const noiDungWithImg = formatWithImageTag(
      data.noiDung || data.tomTat || "",
      img
    );

    const payload = {
      tieuDe: data.tieuDe,
      tomTat: tomTatWithImg,
      noiDung: noiDungWithImg,
      phamVi: data.phamVi ?? 0,
      xuatBanNgay: true,
      xuatBan: true,
    };

    if (isEditing && targetId) {
      await api.put("news", `/api/news/${targetId}`, payload);
    } else {
      await api.post("news", "/api/news", payload);
    }

    setEditingItem(null);
    await loadData();
  };

  const formatNewsDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return {
    isAdmin,
    newsList,
    loading,
    searchQuery,
    setSearchQuery,
    currentTimeStr,
    selectedArticleId,
    setSelectedArticleId,
    formOpen,
    setFormOpen,
    editingItem,
    setEditingItem,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    itemToDelete,
    deleting,
    filteredNews,
    loadData,
    handleViewArticle,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDelete,
    handleConfirmDelete,
    handleSave,
    formatNewsDate,
  };
}
