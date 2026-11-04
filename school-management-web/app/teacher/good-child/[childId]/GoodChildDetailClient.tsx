'use client';

import React, { Suspense } from 'react';
import { Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useGoodChildDetail } from './useGoodChildDetail';
import { GoodChildDetailHeader } from './components/GoodChildDetailHeader';
import { ActivityEvaluationsSidebar } from './components/ActivityEvaluationsSidebar';
import { TeacherCommentEditor } from './components/TeacherCommentEditor';

function GoodChildDetailWorkspace() {
  const {
    month,
    setMonth,
    year,
    setYear,
    childrenList,
    currentChild,
    targetChildApiId,
    childDisplayName,
    comment,
    setComment,
    parentFeedback,
    activityEvals,
    childAwardInfo,
    loading,
    saving,
    copiedId,
    successToast,
    errorMsg,
    setErrorMsg,
    isDelivered,
    evalStats,
    loadWorkspaceData,
    handleInsertActivityEvaluation,
    handleSynthesizeFromActivities,
    handleSaveComment,
    handleToggleDeliver,
    router,
  } = useGoodChildDetail();

  return (
    <section className="mx-auto max-w-7xl space-y-5 pb-10">
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3.5 text-xs font-bold text-white shadow-xl shadow-emerald-600/30 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 size={18} />
          <span>{successToast}</span>
        </div>
      )}

      <GoodChildDetailHeader
        month={month}
        setMonth={setMonth}
        year={year}
        setYear={setYear}
        childrenList={childrenList}
        targetChildApiId={targetChildApiId}
        currentChild={currentChild}
        childDisplayName={childDisplayName}
        isDelivered={isDelivered}
        saving={saving}
        loading={loading}
        childAwardInfo={childAwardInfo}
        onRefresh={() => void loadWorkspaceData()}
        onSelectChild={(nextId) => {
          router.push(
            `/teacher/good-child/${encodeURIComponent(nextId)}?month=${month}&year=${year}`
          );
        }}
        onToggleDeliver={() => void handleToggleDeliver()}
        onSaveComment={() => void handleSaveComment()}
      />

      {errorMsg && (
        <div className="flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-800">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="text-rose-600 hover:text-rose-900">
            <X size={16} />
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white py-24">
          <Loader2 size={32} className="animate-spin text-amber-500 mb-3" />
          <p className="text-xs font-bold text-slate-500">
            Đang tải lịch sử nhận xét hoạt động và Sổ Bé Ngoan của bé...
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          <ActivityEvaluationsSidebar
            activityEvals={activityEvals}
            evalStats={evalStats}
            childDisplayName={childDisplayName}
            month={month}
            year={year}
            copiedId={copiedId}
            onSynthesize={handleSynthesizeFromActivities}
            onInsertEvaluation={handleInsertActivityEvaluation}
          />

          <TeacherCommentEditor
            childDisplayName={childDisplayName}
            month={month}
            year={year}
            comment={comment}
            setComment={setComment}
            parentFeedback={parentFeedback}
            isDelivered={isDelivered}
            saving={saving}
            onToggleDeliver={() => void handleToggleDeliver()}
            onSaveComment={() => void handleSaveComment()}
          />
        </div>
      )}
    </section>
  );
}

export default function GoodChildDetailClient() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-24">
          <Loader2 className="animate-spin text-amber-500" size={32} />
        </div>
      }
    >
      <GoodChildDetailWorkspace />
    </Suspense>
  );
}
