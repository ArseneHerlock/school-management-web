"use client";

import React from "react";
import { Home, Search, Plus, RefreshCw } from "lucide-react";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import NewsDetailPage from "./NewsDetailPage";
import NewsFormModal from "./NewsFormModal";
import { useNewsList } from "./useNewsList";
import NewsListItemCard from "./NewsListItemCard";

interface NewsListViewProps {
  role: "admin" | "teacher" | "parent";
  pageTitle?: string;
  pageSubtitle?: string;
}

export default function NewsListView({
  role,
}: NewsListViewProps) {
  const {
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
  } = useNewsList({ role });

  // Detail Page View
  if (selectedArticleId) {
    return (
      <>
        <NewsDetailPage
          key={`${selectedArticleId}-${newsList.length}`}
          newsId={selectedArticleId}
          role={role}
          onBack={() => setSelectedArticleId(null)}
          onEdit={
            isAdmin
              ? (art) => {
                  setEditingItem({
                    id: art.id,
                    tieuDe: art.tieuDe,
                    tomTat: art.tomTat,
                    noiDung: art.noiDung,
                    hinhAnh: art.hinhAnh,
                    phamVi: art.phamVi,
                    loaiTin: "NEWS",
                  });
                  setFormOpen(true);
                }
              : undefined
          }
          onDelete={
            isAdmin
              ? (art) => {
                  handleOpenDelete(art, {} as React.MouseEvent);
                }
              : undefined
          }
        />
        {isAdmin && (
          <NewsFormModal
            isOpen={formOpen}
            onClose={() => setFormOpen(false)}
            onSave={handleSave}
            initialData={editingItem}
          />
        )}
        {isAdmin && (
          <ConfirmModal
            isOpen={deleteConfirmOpen}
            onClose={() => setDeleteConfirmOpen(false)}
            onConfirm={handleConfirmDelete}
            title="Xác nhận xóa bài viết"
            message={`Bạn có chắc chắn muốn xóa "${
              itemToDelete?.tieuDe || "bài viết này"
            }" không? Hành động này sẽ xóa dữ liệu khỏi hệ thống.`}
            confirmText="Xóa vĩnh viễn"
            cancelText="Giữ lại"
            variant="danger"
            loading={deleting}
          />
        )}
      </>
    );
  }

  return (
    <div className="space-y-4 w-full max-w-7xl mx-auto font-sans px-2 sm:px-4 overflow-x-hidden">
      {/* Top Breadcrumb Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 font-medium">
          <Home size={14} className="text-slate-600" />
          <span className="hover:text-blue-700 cursor-pointer">Trang chủ</span>
          <span>»</span>
          <span className="hover:text-blue-700 cursor-pointer">Bản tin</span>
          <span>»</span>
          <span className="font-bold text-slate-700">Thông báo nhà trường</span>
        </div>
        <div className="italic text-slate-400">{currentTimeStr}</div>
      </div>

      {/* Control Actions Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3.5 py-2 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none"
            placeholder="Tìm kiếm tin tức, thông báo nhà trường..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={() => void loadData()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
            title="Làm mới"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Làm mới</span>
          </button>

          {isAdmin && (
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white transition shadow-sm cursor-pointer"
            >
              <Plus size={15} />
              <span>Đăng tin mới</span>
            </button>
          )}
        </div>
      </div>

      {/* News Feed Container */}
      <div className="bg-white p-4 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="text-center pt-1 pb-4">
          <h2 className="text-lg font-black tracking-widest text-[#0066b2] uppercase">
            BẢN TIN & THÔNG BÁO NHÀ TRƯỜNG
          </h2>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="h-[1px] w-24 bg-slate-200"></span>
            <span className="w-1.5 h-1.5 rotate-45 bg-[#0066b2]"></span>
            <span className="h-[1px] w-24 bg-slate-200"></span>
          </div>
        </div>

        {filteredNews.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            Chưa có bản tin nào từ hệ thống.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 space-y-6">
            {filteredNews.map((item, idx) => (
              <NewsListItemCard
                key={item.id}
                item={item}
                idx={idx}
                isAdmin={isAdmin}
                formatNewsDate={formatNewsDate}
                onView={handleViewArticle}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Editor Modal for Admin Only */}
      {isAdmin && (
        <NewsFormModal
          isOpen={formOpen}
          onClose={() => setFormOpen(false)}
          onSave={handleSave}
          initialData={editingItem}
        />
      )}

      {/* Confirm Modal for Delete */}
      {isAdmin && (
        <ConfirmModal
          isOpen={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Xác nhận xóa bài viết"
          message={`Bạn có chắc chắn muốn xóa "${
            itemToDelete?.tieuDe || "bài viết này"
          }" không? Hành động này sẽ xóa dữ liệu khỏi hệ thống.`}
          confirmText="Xóa vĩnh viễn"
          cancelText="Giữ lại"
          variant="danger"
          loading={deleting}
        />
      )}
    </div>
  );
}
