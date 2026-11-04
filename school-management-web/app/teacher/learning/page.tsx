'use client';

import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';
import { getMediaUrl } from '@/services';
import MediaLightbox from '@/app/admin/components/shared/MediaLightbox';
import { TeacherChildrenList } from './components/TeacherChildrenList';
import { SelectedChildHeader } from './components/SelectedChildHeader';
import { AddProductForm } from './components/AddProductForm';
import { ChildProductFilters } from './components/ChildProductFilters';
import { ChildProductGrid } from './components/ChildProductGrid';
import { useTeacherLearning } from './useTeacherLearning';

export default function TeacherLearningPage() {
  const {
    children,
    activities,
    loading,
    selectedChild,
    setSelectedChild,
    searchQuery,
    setSearchQuery,
    productSearch,
    setProductSearch,
    selectedActivityFilter,
    setSelectedActivityFilter,
    selectedMonthFilter,
    setSelectedMonthFilter,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    showAddForm,
    setShowAddForm,
    productTitle,
    setProductTitle,
    productActivityId,
    setProductActivityId,
    productDate,
    setProductDate,
    productCategory,
    setProductCategory,
    productComment,
    setProductComment,
    uploadedMediaId,
    setUploadedMediaId,
    mediaPreviewUrl,
    setMediaPreviewUrl,
    uploadingFile,
    submittingProduct,
    lightboxOpen,
    setLightboxOpen,
    lightboxIndex,
    setLightboxIndex,
    toast,
    setToast,
    activeUserId,
    isUserAdmin,
    loadData,
    childProductCountMap,
    filteredChildren,
    selectedChildProducts,
    availableChildActivities,
    availableChildMonths,
    availableChildCategories,
    filteredChildProducts,
    hasChildActiveFilter,
    resetChildFilters,
    handleFileUpload,
    handleSubmitProduct,
    handleDeleteProduct,
    setProductActivityTitle,
    className,
  } = useTeacherLearning();

  const lightboxItems = filteredChildProducts.map((p) => ({
    id: p.id,
    url: getMediaUrl(p.mediaId),
    title: p.displayTitle,
    date: p.dateStr,
    type: 'image' as const,
    description: p.cleanDesc,
  }));

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {toast && (
        <div
          className={`rounded-2xl p-4 text-xs font-bold flex items-center justify-between shadow-xs transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : toast.type === 'warning'
              ? 'bg-amber-50 text-amber-800 border border-amber-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'warning' ? (
              <ShieldAlert size={16} className="text-amber-600" />
            ) : (
              <AlertCircle size={16} />
            )}
            <span>{toast.text}</span>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-slate-700 font-bold ml-4 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {selectedChild ? (
        <div className="space-y-6">
          <SelectedChildHeader
            selectedChild={selectedChild}
            classNameTitle={className}
            productCount={selectedChildProducts.length}
            showAddForm={showAddForm}
            onToggleAddForm={() => setShowAddForm(!showAddForm)}
            onBack={() => {
              setSelectedChild(null);
              setShowAddForm(false);
            }}
          />

          {showAddForm && (
            <AddProductForm
              childName={selectedChild.name}
              onClose={() => setShowAddForm(false)}
              mediaPreviewUrl={mediaPreviewUrl}
              onClearMedia={() => {
                setUploadedMediaId('');
                setMediaPreviewUrl('');
              }}
              uploadingFile={uploadingFile}
              onFileUpload={(file) => void handleFileUpload(file)}
              productTitle={productTitle}
              onProductTitleChange={setProductTitle}
              productActivityId={productActivityId}
              onProductActivityChange={(id, name) => {
                setProductActivityId(id);
                setProductActivityTitle(name);
              }}
              activities={activities}
              productDate={productDate}
              onProductDateChange={setProductDate}
              productCategory={productCategory}
              onProductCategoryChange={setProductCategory}
              productComment={productComment}
              onProductCommentChange={setProductComment}
              submittingProduct={submittingProduct}
              onSubmit={() => void handleSubmitProduct()}
              uploadedMediaId={uploadedMediaId}
            />
          )}

          <ChildProductFilters
            productSearch={productSearch}
            onProductSearchChange={setProductSearch}
            selectedActivityFilter={selectedActivityFilter}
            onActivityFilterChange={setSelectedActivityFilter}
            availableChildActivities={availableChildActivities}
            selectedMonthFilter={selectedMonthFilter}
            onMonthFilterChange={setSelectedMonthFilter}
            availableChildMonths={availableChildMonths}
            totalChildProductsCount={selectedChildProducts.length}
            availableChildCategories={availableChildCategories}
            selectedCategoryFilter={selectedCategoryFilter}
            onCategoryFilterChange={setSelectedCategoryFilter}
            selectedChildProducts={selectedChildProducts}
            hasChildActiveFilter={hasChildActiveFilter}
            onResetChildFilters={resetChildFilters}
          />

          <ChildProductGrid
            filteredChildProducts={filteredChildProducts}
            hasChildActiveFilter={hasChildActiveFilter}
            childName={selectedChild.name}
            totalProductsCount={selectedChildProducts.length}
            onResetChildFilters={resetChildFilters}
            onOpenLightbox={(idx) => {
              setLightboxIndex(idx);
              setLightboxOpen(true);
            }}
            onDeleteProduct={(id, createdBy) => void handleDeleteProduct(id, createdBy)}
            isUserAdmin={Boolean(isUserAdmin)}
            activeUserId={activeUserId}
          />

          <MediaLightbox
            media={lightboxItems}
            initialIndex={lightboxIndex}
            isOpen={lightboxOpen}
            onClose={() => setLightboxOpen(false)}
          />
        </div>
      ) : (
        <TeacherChildrenList
          classNameTitle={className}
          loading={loading}
          onRefresh={() => void loadData()}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filteredChildren={filteredChildren}
          totalChildrenCount={children.length}
          childProductCountMap={childProductCountMap}
          onSelectChild={(child) => {
            setSelectedChild(child);
            setShowAddForm(false);
          }}
        />
      )}
    </div>
  );
}
