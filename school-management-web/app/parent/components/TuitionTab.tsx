'use client';

import { LayoutGrid, ShieldCheck } from 'lucide-react';
import { ChildInfo } from '../types';
import TuitionSummaryCards from './tuition/TuitionSummaryCards';
import TuitionPeriodsTable from './tuition/TuitionPeriodsTable';
import OtherFeesTable from './tuition/OtherFeesTable';
import TuitionPaymentModal from './tuition/TuitionPaymentModal';
import TuitionSkeleton from './tuition/TuitionSkeleton';
import { useParentTuition } from './tuition/useParentTuition';

const money = (n: any) => Number(n || 0).toLocaleString('vi-VN');

interface TuitionTabProps {
  child: ChildInfo;
  items?: any[];
  history?: any[];
  parentId?: string | null;
}

export default function TuitionTab({ child }: TuitionTabProps) {
  const {
    selectedSemester,
    setSelectedSemester,
    activeSubTab,
    setActiveSubTab,
    expandedPeriods,
    setExpandedPeriods,
    loading,
    liveFees,
    payModalOpen,
    setPayModalOpen,
    paying,
    paySuccess,
    setPaySuccess,
    mealDeduction,
    semestersList,
    otherFeesData,
    otherFeesTotals,
    tuitionPeriods,
    totals,
    handleExecutePayment,
  } = useParentTuition(child);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
            <LayoutGrid size={19} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Học phí</h2>
          </div>
        </div>

        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className="rounded-2xl border border-emerald-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 outline-none focus:border-emerald-400 shadow-xs"
        >
          {semestersList.map((s) => (<option key={s.id} value={s.id}>{s.label}</option>))}
        </select>
      </div>

      {loading && liveFees.length === 0 ? (
        <TuitionSkeleton />
      ) : (
        <>
          <TuitionSummaryCards
            totalMucNop={totals.mucNop}
            totalDaNop={totals.daNop}
            totalCongNo={totals.congNo}
            money={money}
            onOpenPayModal={() => { setPaySuccess(false); setPayModalOpen(true); }}
          />

          <div className="flex items-center gap-2 border-b border-emerald-100 pb-2">
            <button
              onClick={() => setActiveSubTab('hoc_phi')}
              className={`rounded-2xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                activeSubTab === 'hoc_phi'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-emerald-50'
              }`}
            >
              Hóa đơn học phí theo tháng ({tuitionPeriods.length} đợt)
            </button>
            <button
              onClick={() => setActiveSubTab('bieu_phi')}
              className={`rounded-2xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                activeSubTab === 'bieu_phi'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-emerald-50'
              }`}
            >
              Biểu phí niêm yết ({otherFeesData.length})
            </button>
          </div>

          {activeSubTab === 'hoc_phi' ? (
            <TuitionPeriodsTable
              periods={tuitionPeriods}
              expandedPeriods={expandedPeriods}
              togglePeriod={(id) => setExpandedPeriods((p) => ({ ...p, [id]: p[id] === undefined ? false : !p[id] }))}
              money={money}
            />
          ) : (
            <OtherFeesTable
              otherFeesData={otherFeesData}
              otherFeesTotals={otherFeesTotals}
              money={money}
            />
          )}
        </>
      )}

      <TuitionPaymentModal
        isOpen={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        payAmount={totals.congNo || 3240000}
        money={money}
        child={child}
        paying={paying}
        paySuccess={paySuccess}
        onExecutePayment={handleExecutePayment}
      />
    </div>
  );
}
