import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  getGoodChildRecords,
  createGoodChildRecord,
  updateGoodChildTeacherComment,
} from '@/services/learning';
import { FridayAwardChild } from '@/services/awards';
import { CHILDREN, loadLiveTeacherChildren, type Child } from '../../data';
import {
  getEvaluationsForChild,
  synthesizeGoodChildComment,
  isGoodChildDelivered,
  setGoodChildDelivered,
  ActivityChildEvaluation,
} from "@/services/schedule";

const normalizeRecordList = (x: any) =>
  Array.isArray(x) ? x : Array.isArray(x?.items) ? x.items : [];

export function useGoodChildDetail() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawChildId = String(params?.childId || '');
  const initialMonth = Number(searchParams.get('month')) || new Date().getMonth() + 1;
  const initialYear = Number(searchParams.get('year')) || new Date().getFullYear();

  const [month, setMonth] = useState<number>(initialMonth);
  const [year, setYear] = useState<number>(initialYear);
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [currentChild, setCurrentChild] = useState<Child | null>(null);

  const [recordId, setRecordId] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [parentFeedback, setParentFeedback] = useState<string>('');
  const [activityEvals, setActivityEvals] = useState<ActivityChildEvaluation[]>([]);
  const [childAwardInfo, setChildAwardInfo] = useState<FridayAwardChild | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isDelivered, setIsDelivered] = useState<boolean>(false);

  const loadWorkspaceData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await loadLiveTeacherChildren();
      const allChildren = [...CHILDREN];
      setChildrenList(allChildren);

      const foundChild =
        allChildren.find(
          (c) =>
            String(c.apiId).toLowerCase() === rawChildId.toLowerCase() ||
            String(c.id) === rawChildId
        ) || null;
      setCurrentChild(foundChild);

      const targetChildApiId = foundChild?.apiId || rawChildId;

      const [recordsRes, evalsRes, awardRes, delivRes] = await Promise.all([
        getGoodChildRecords({
          month,
          year,
          pageSize: 100,
        }).catch(() => []),
        getEvaluationsForChild(targetChildApiId, month, year).catch(() => []),
        fetch(`/api/friday-awards?childId=${targetChildApiId}&month=${month}&year=${year}`)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
        fetch(`/api/good-child-delivery?childId=${targetChildApiId}&month=${month}&year=${year}`)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
      ]);

      const allRecords = normalizeRecordList(recordsRes);
      const matchedRecord = allRecords.find(
        (r: any) => String(r.childId).toLowerCase() === String(targetChildApiId).toLowerCase()
      );

      if (awardRes && Array.isArray(awardRes.children)) {
        const found = awardRes.children.find(
          (c: any) => String(c.childId).toLowerCase() === String(targetChildApiId).toLowerCase()
        );
        setChildAwardInfo(found || null);
      } else {
        setChildAwardInfo(null);
      }

      setRecordId(matchedRecord?.id || '');
      setComment(matchedRecord?.teacherComment || '');
      setParentFeedback(matchedRecord?.parentFeedback || '');
      setActivityEvals(evalsRes || []);
      setIsDelivered(delivRes ? Boolean(delivRes.isDelivered) : isGoodChildDelivered(targetChildApiId, month, year));
    } catch (err: any) {
      setErrorMsg(err instanceof Error ? err.message : 'Không tải được dữ liệu sổ bé ngoan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (rawChildId) {
      void loadWorkspaceData();
    }
  }, [rawChildId, month, year]);

  const targetChildApiId = currentChild?.apiId || rawChildId;
  const childDisplayName = currentChild?.name || 'Học sinh';

  const evalStats = useMemo(() => {
    const total = activityEvals.length;
    const passed = activityEvals.filter(
      (e) => e.completed || e.result === true || e.result === 'Đạt'
    ).length;
    const failed = total - passed;
    const withCommentCount = activityEvals.filter((e) => Boolean(e.comment?.trim())).length;
    return { total, passed, failed, withCommentCount };
  }, [activityEvals]);

  const handleInsertActivityEvaluation = (ev: ActivityChildEvaluation) => {
    const dateStr = ev.date
      ? new Date(ev.date).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
        })
      : '';
    const statusText = ev.result ? 'Đạt' : 'Cần rèn luyện thêm';
    const remarkPart = ev.comment?.trim()
      ? ev.comment.trim()
      : `${ev.criterionName || ev.activityTitle}: ${statusText}`;

    const line = `• [${ev.activityTitle}${
      ev.criterionName && ev.criterionName !== ev.activityTitle ? ` - ${ev.criterionName}` : ''
    }${dateStr ? ` (${dateStr})` : ''}]: ${remarkPart}`;

    setComment((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return line;
      if (trimmed.includes(line)) return trimmed;
      return `${trimmed}\n${line}`;
    });

    setCopiedId(ev.id || `${ev.activityTitle}-${ev.criterionId}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSynthesizeFromActivities = () => {
    if (activityEvals.length === 0) return;
    const synthesized = synthesizeGoodChildComment(activityEvals, childDisplayName, month);
    if (synthesized) {
      setComment(synthesized);
      setSuccessToast(
        `Đã tổng hợp nhận xét từ ${activityEvals.length} lượt đánh giá hoạt động của bé ${childDisplayName}!`
      );
      setTimeout(() => setSuccessToast(''), 3000);
    }
  };

  const handleSaveComment = async () => {
    setSaving(true);
    setErrorMsg('');
    try {
      let currentRecId = recordId;
      if (!currentRecId) {
        const created = await createGoodChildRecord({
          childId: targetChildApiId,
          month,
          year,
        });
        if (created?.id) {
          currentRecId = created.id;
          setRecordId(created.id);
        }
      }

      if (currentRecId) {
        await updateGoodChildTeacherComment(currentRecId, comment);
      }

      if (comment.trim()) {
        setGoodChildDelivered(targetChildApiId, month, year, true);
        setIsDelivered(true);
      }

      setSuccessToast(`Đã lưu Sổ Bé Ngoan tháng ${month}/${year} cho bé ${childDisplayName}!`);
      setTimeout(() => setSuccessToast(''), 3500);
    } catch (err: any) {
      setErrorMsg(err instanceof Error ? err.message : 'Không thể lưu nhận xét rèn luyện');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleDeliver = async () => {
    const nextState = !isDelivered;
    setGoodChildDelivered(targetChildApiId, month, year, nextState);
    setIsDelivered(nextState);

    try {
      const res = await fetch('/api/good-child-delivery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId: targetChildApiId,
          month,
          year,
          delivered: nextState,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccessToast(data.message);
    } catch (err: any) {
      setGoodChildDelivered(targetChildApiId, month, year, !nextState);
      setIsDelivered(!nextState);
      setErrorMsg(err.message || 'Lỗi khi cập nhật trạng thái bàn giao sổ');
    }
    setTimeout(() => setSuccessToast(''), 3500);
  };

  return {
    rawChildId,
    month,
    setMonth,
    year,
    setYear,
    childrenList,
    currentChild,
    targetChildApiId,
    childDisplayName,
    recordId,
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
  };
}
