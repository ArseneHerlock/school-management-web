'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { getGoodChildRecords, updateParentFeedback } from '@/services/learning';
import { isGoodChildDelivered } from '@/services/schedule';
import { ChildInfo } from '../types';
import { list, activeFlowers, isLarge } from './good-child/types';
import { GoodChildBanner } from './good-child/GoodChildBanner';
import { YearEndAwardSpotlight } from './good-child/YearEndAwardSpotlight';
import { FridayAwardProgressCard } from './good-child/FridayAwardProgressCard';
import { LatestRecordCard } from './good-child/LatestRecordCard';
import { MonthlyHistoryList } from './good-child/MonthlyHistoryList';
import { ParentCertificateModal } from './good-child/ParentCertificateModal';

export default function GoodChildTab({ child }: { child: ChildInfo }) {
  const [rows, setRows] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState('');

  // Year-end award & Friday award states
  const [yearEndAward, setYearEndAward] = useState<any | null>(null);
  const [fridayAward, setFridayAward] = useState<any | null>(null);
  const [showCertModal, setShowCertModal] = useState(false);
  const [isDeliveredByTeacher, setIsDeliveredByTeacher] = useState(false);

  const load = async () => {
    if (!child.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const curMonth = new Date().getMonth() + 1;
      const curYear = new Date().getFullYear();

      const [goodChildRes, awardRes, fridayRes, delivRes] = await Promise.allSettled([
        getGoodChildRecords({ childId: child.id, pageSize: 100 }),
        fetch(`/api/year-end-awards?childId=${child.id}`).then((r) =>
          r.ok ? r.json() : null
        ),
        fetch(`/api/friday-awards?childId=${child.id}&month=${curMonth}&year=${curYear}`).then((r) =>
          r.ok ? r.json() : null
        ),
        fetch(`/api/good-child-delivery?childId=${child.id}&month=${curMonth}&year=${curYear}`).then((r) =>
          r.ok ? r.json() : null
        ),
      ]);

      if (goodChildRes.status === 'fulfilled') {
        const records = list(goodChildRes.value).sort((a: any, b: any) =>
          `${b.year}-${String(b.month).padStart(2, '0')}`.localeCompare(
            `${a.year}-${String(a.month).padStart(2, '0')}`
          )
        );
        setRows(records);
        setFeedback(
          Object.fromEntries(
            records.map((record: any) => [
              record.id,
              record.parentFeedback || '',
            ])
          )
        );
      }

      if (awardRes.status === 'fulfilled' && awardRes.value) {
        setYearEndAward(awardRes.value);
      } else {
        setYearEndAward(null);
      }

      if (fridayRes.status === 'fulfilled' && fridayRes.value) {
        const fChildren = fridayRes.value.children || [];
        const myChildFriday = fChildren.find(
          (c: any) => String(c.childId).toLowerCase() === String(child.id).toLowerCase()
        );
        setFridayAward(myChildFriday || null);
      }

      if (delivRes.status === 'fulfilled' && delivRes.value) {
        setIsDeliveredByTeacher(Boolean(delivRes.value.isDelivered));
      }
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Không tải được sổ theo dõi rèn luyện'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [child.id]);

  const latest = rows[0];
  const isRecordDelivered = (record: any) => {
    if (!record) return false;
    return isDeliveredByTeacher || Boolean(record.isDelivered) || isGoodChildDelivered(
      child.id,
      record.month,
      record.year,
      child.lop
    );
  };
  const isLatestDelivered = latest ? isRecordDelivered(latest) : false;

  const latestDaily = latest
    ? activeFlowers(latest).filter((flower: any) => !isLarge(flower))
    : [];
  const totalDaily = Math.max(
    fridayAward?.totalFlowerCount ?? fridayAward?.monthFlowerCount ?? 0,
    rows.reduce(
      (sum, record) =>
        sum +
        Number(
          record.dailyFlowerCount ||
            activeFlowers(record).filter((f: any) => !isLarge(f)).length ||
            0
        ),
      0
    )
  );
  const totalBonus = Math.max(
    fridayAward?.monthStarCount ?? (fridayAward?.hasMonthlyStar ? 1 : 0),
    rows.reduce(
      (sum, record) =>
        sum +
        Number(
          record.bonusFlowerCount ||
            activeFlowers(record).filter(isLarge).length ||
            0
        ),
      0
    )
  );
  const monthProgress = Math.min(
    4,
    Math.max(
      fridayAward?.monthFlowerCount ?? 0,
      latest?.dailyFlowerCount || latestDaily.length || 0
    )
  );
  const monthLabel = latest
    ? `Tháng ${latest.month}/${latest.year}`
    : 'Chưa có kỳ ghi nhận';

  const saveFeedback = async (id: string) => {
    const text = feedback[id]?.trim() || '';
    if (!text) return;
    try {
      setSaving(id);
      await updateParentFeedback(id, text);
      await load();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Không thể gửi phản hồi'
      );
    } finally {
      setSaving('');
    }
  };

  const monthlySummary = useMemo(
    () =>
      rows.map((record) => {
        const currentFlowers = activeFlowers(record);
        return {
          record,
          daily: currentFlowers.filter((flower: any) => !isLarge(flower)),
          bonus: currentFlowers.filter(isLarge),
        };
      }),
    [rows]
  );

  return (
    <section className="min-w-0 max-w-full space-y-3 sm:space-y-4 overflow-x-hidden pb-12 font-sans">
      <GoodChildBanner
        child={child}
        loading={loading}
        onRefresh={() => void load()}
        monthLabel={monthLabel}
        totalDaily={totalDaily}
        totalBonus={totalBonus}
      />

      <YearEndAwardSpotlight
        yearEndAward={yearEndAward}
        onOpenCertModal={() => setShowCertModal(true)}
      />

      <FridayAwardProgressCard
        child={child}
        fridayAward={fridayAward}
        monthProgress={monthProgress}
      />

      {loading ? (
        <div className="flex min-h-64 items-center justify-center rounded-3xl border border-slate-100 bg-white">
          <Loader2 className="animate-spin text-amber-500" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <AlertCircle size={19} />
          {error}
        </div>
      ) : (
        <>
          <LatestRecordCard
            latest={latest}
            isLatestDelivered={isLatestDelivered}
            monthProgress={monthProgress}
            feedback={feedback}
            setFeedback={setFeedback}
            saving={saving}
            onSaveFeedback={(id) => void saveFeedback(id)}
          />

          <MonthlyHistoryList
            monthlySummary={monthlySummary}
            totalPeriods={rows.length}
            isRecordDelivered={isRecordDelivered}
          />
        </>
      )}

      <ParentCertificateModal
        show={showCertModal}
        onClose={() => setShowCertModal(false)}
        yearEndAward={yearEndAward}
        child={child}
      />
    </section>
  );
}
