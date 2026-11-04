'use client';

import React from 'react';
import { Loader2, AlertCircle, ShieldAlert } from 'lucide-react';
import MediaLightbox from '@/app/admin/components/shared/MediaLightbox';
import Pagination from '@/app/admin/components/shared/Pagination';
import TeacherPostMomentModal from '../components/TeacherPostMomentModal';
import { AlbumHeader } from './components/AlbumHeader';
import { AlbumFilterBar } from './components/AlbumFilterBar';
import { AlbumPhotoGrid } from './components/AlbumPhotoGrid';
import { useTeacherAlbum } from './useTeacherAlbum';

export default function TeacherAlbumPage() {
  const {
    photos,
    classInfo,
    loading,
    message,
    setMessage,
    selectedCategory,
    setSelectedCategory,
    selectedActivityId,
    setSelectedActivityId,
    selectedMonth,
    setSelectedMonth,
    selectedScope,
    setSelectedScope,
    searchKeyword,
    setSearchKeyword,
    currentPage,
    setCurrentPage,
    lightboxOpen,
    setLightboxOpen,
    lightboxIndex,
    setLightboxIndex,
    postModalOpen,
    setPostModalOpen,
    activeUserId,
    isUserAdmin,
    loadPhotos,
    availableActivities,
    availableMonths,
    handleDelete,
    filteredPhotos,
    resetFilters,
    hasFilterActive,
  } = useTeacherAlbum();

  const itemsPerPage = 12;
  const currentClassName = classInfo?.tenLop || classInfo?.TenLop || 'Lớp của cô';

  const totalPages = Math.ceil(filteredPhotos.length / itemsPerPage);
  const paginatedPhotos = filteredPhotos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <AlbumHeader
        classNameTitle={currentClassName}
        totalPhotos={photos.length}
        onOpenPostModal={() => setPostModalOpen(true)}
      />

      {message && (
        <div
          className={`rounded-2xl p-4 text-xs font-bold flex items-center justify-between shadow-xs transition-all ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : message.type === 'warning'
              ? 'bg-amber-50 text-amber-800 border border-amber-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'warning' ? (
              <ShieldAlert size={16} className="text-amber-600" />
            ) : (
              <AlertCircle size={16} />
            )}
            <span>{message.text}</span>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="text-slate-400 hover:text-slate-700 font-bold ml-4 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      <AlbumFilterBar
        searchKeyword={searchKeyword}
        onSearchChange={(val: string) => {
          setSearchKeyword(val);
          setCurrentPage(1);
        }}
        selectedActivityId={selectedActivityId}
        onActivityChange={(val: string) => {
          setSelectedActivityId(val);
          setCurrentPage(1);
        }}
        availableActivities={availableActivities}
        selectedMonth={selectedMonth}
        onMonthChange={(val: string) => {
          setSelectedMonth(val);
          setCurrentPage(1);
        }}
        availableMonths={availableMonths}
        totalPhotosCount={photos.length}
        selectedScope={selectedScope}
        onScopeChange={(scope: 'ALL' | 'class' | 'child') => {
          setSelectedScope(scope);
          setCurrentPage(1);
        }}
        selectedCategory={selectedCategory}
        onCategoryChange={(cat: string) => {
          setSelectedCategory(cat);
          setCurrentPage(1);
        }}
        hasActiveFilter={hasFilterActive}
        onResetFilters={resetFilters}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100">
          <Loader2 className="h-9 w-9 animate-spin text-orange-500" />
          <p className="mt-3 text-xs font-semibold text-slate-500">
            Đang tải dữ liệu album khoảnh khắc...
          </p>
        </div>
      ) : (
        <AlbumPhotoGrid
          photos={paginatedPhotos}
          classNameTitle={currentClassName}
          selectedMonth={selectedMonth}
          hasActiveFilter={hasFilterActive}
          onResetFilters={resetFilters}
          onOpenLightbox={(idx) => {
            const actualIdx = (currentPage - 1) * itemsPerPage + idx;
            setLightboxIndex(actualIdx);
            setLightboxOpen(true);
          }}
          onDelete={(id, createdBy) => void handleDelete(id, createdBy)}
          isUserAdmin={Boolean(isUserAdmin)}
          activeUserId={activeUserId}
          totalPhotosCount={photos.length}
        />
      )}

      {totalPages > 1 && (
        <div className="flex justify-center pt-2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredPhotos.length}
            pageSize={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <MediaLightbox
        media={filteredPhotos.map((p) => ({
          id: p.id,
          url: p.url,
          title: p.title,
          date: p.date,
          type: p.type,
          description: p.cleanNote,
        }))}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />

      <TeacherPostMomentModal
        isOpen={postModalOpen}
        onClose={() => setPostModalOpen(false)}
        defaultClassId={classInfo?.id || classInfo?.Id}
        defaultClassName={currentClassName}
        onSuccess={() => void loadPhotos()}
      />
    </div>
  );
}
