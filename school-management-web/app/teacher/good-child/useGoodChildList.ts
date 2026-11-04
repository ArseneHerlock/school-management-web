import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getGoodChildRecords } from "@/services/learning";
import {
  getFridayAwardsStatus,
  submitFridayAwards,
  FridayAwardChild,
  FridayAwardsResponse,
} from "@/services/awards";
import {
  CHILDREN,
  loadLiveTeacherChildren,
  loadLiveTeacherContext,
  type Child,
} from "../data";
import { setGoodChildDelivered } from "@/services/schedule";

const list = (x: any) =>
  Array.isArray(x) ? x : Array.isArray(x?.items) ? x.items : [];

export type ActiveTab = "FRIDAY_AWARDS" | "MONTHLY_BOOK";

export function useGoodChildList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialMonth =
    Number(searchParams.get("month")) || new Date().getMonth() + 1;
  const initialYear =
    Number(searchParams.get("year")) || new Date().getFullYear();

  const [activeTab, setActiveTab] = useState<ActiveTab>("FRIDAY_AWARDS");
  const [classId, setClassId] = useState<string>("");
  const [className, setClassName] = useState<string>("Lớp học");
  const [teacherUserId, setTeacherUserId] = useState<string>("");

  const [children, setChildren] = useState<Child[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const [busy, setBusy] = useState(true);
  const [successToast, setSuccessToast] = useState("");
  const [msg, setMsg] = useState("");

  const [fridayData, setFridayData] = useState<FridayAwardsResponse | null>(null);
  const [selectedChildIds, setSelectedChildIds] = useState<Set<string>>(new Set());
  const [awarding, setAwarding] = useState(false);

  const [classDelivery, setClassDelivery] = useState<{
    isDelivered: boolean;
    deliveredCount: number;
    totalCount: number;
    childrenMap: Record<string, boolean>;
  }>({ isDelivered: false, deliveredCount: 0, totalCount: 0, childrenMap: {} });
  const [deliveringClass, setDeliveringClass] = useState(false);

  const fridayAwardMap = useMemo(() => {
    const map = new Map<string, FridayAwardChild>();
    fridayData?.children?.forEach((c) => {
      map.set(String(c.childId).toLowerCase(), c);
    });
    return map;
  }, [fridayData]);

  const loadData = async () => {
    setBusy(true);
    setMsg("");
    try {
      const ctx = await loadLiveTeacherContext().catch(() => null);
      const cId = (ctx?.cls as any)?.id || (ctx?.cls as any)?.Id || "";
      setClassId(cId);
      setClassName(ctx?.cls?.tenLop || "Lớp Mầm 1");
      setTeacherUserId(ctx?.me?.userId || (ctx?.me as any)?.UserId || "");

      await loadLiveTeacherChildren().catch(() => null);
      setChildren([...CHILDREN]);

      const r = await getGoodChildRecords({
        month,
        year,
        pageSize: 100,
      }).catch(() => []);
      setRows(list(r));

      if (cId) {
        const [fData, delRes] = await Promise.all([
          getFridayAwardsStatus(cId, undefined, month, year).catch(() => null),
          fetch(
            `/api/good-child-delivery?classId=${cId}&month=${month}&year=${year}`
          )
            .then((res) => (res.ok ? res.json() : null))
            .catch(() => null),
        ]);

        if (fData) {
          setFridayData(fData);
          const defaultSelected = new Set<string>();
          fData.children.forEach((c) => {
            if (c.isQualified && !c.hasAwardedToday) {
              defaultSelected.add(c.childId);
            }
          });
          setSelectedChildIds(defaultSelected);
        }

        if (delRes) {
          setClassDelivery(delRes);
        }
      }
    } catch (e: any) {
      setMsg(
        e instanceof Error ? e.message : "Không tải được dữ liệu sổ bé ngoan"
      );
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [month, year]);

  const toggleSelectChild = (id: string) => {
    const next = new Set(selectedChildIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedChildIds(next);
  };

  const handleSelectAll = (select: boolean) => {
    if (!fridayData) return;
    if (select) {
      setSelectedChildIds(new Set(fridayData.children.map((c) => c.childId)));
    } else {
      setSelectedChildIds(new Set());
    }
  };

  const handleAwardFriday = async () => {
    if (!classId || selectedChildIds.size === 0) {
      alert("Vui lòng chọn ít nhất một bé để phát phiếu.");
      return;
    }

    setAwarding(true);
    try {
      const res = await submitFridayAwards({
        classId,
        awardDate:
          fridayData?.targetDate || new Date().toISOString().slice(0, 10),
        awardedChildIds: Array.from(selectedChildIds),
        reason: "Phiếu Bé Ngoan Thứ 6",
        teacherUserId,
      });

      setSuccessToast(res.message);
      setTimeout(() => setSuccessToast(""), 4500);
      await loadData();
    } catch (err: any) {
      alert(err.message || "Lỗi khi phát phiếu bé ngoan.");
    } finally {
      setAwarding(false);
    }
  };

  const handleToggleDeliverAllClass = async () => {
    if (!classId) return;
    const nextDelivered = !classDelivery.isDelivered;
    setDeliveringClass(true);
    try {
      const res = await fetch("/api/good-child-delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId,
          month,
          year,
          delivered: nextDelivered,
          teacherUserId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi cập nhật bàn giao sổ");

      children.forEach((child) => {
        const cId = child.apiId || String(child.id);
        setGoodChildDelivered(cId, month, year, nextDelivered);
      });

      setSuccessToast(data.message);
      setTimeout(() => setSuccessToast(""), 3500);
      await loadData();
    } catch (err: any) {
      alert(err.message || "Không thể cập nhật trạng thái bàn giao sổ");
    } finally {
      setDeliveringClass(false);
    }
  };

  const rowFor = (id: string) =>
    rows.find((x) => String(x.childId) === String(id));

  const handleOpenChildPage = (child: Child) => {
    const cId = child.apiId || String(child.id);
    router.push(
      `/teacher/good-child/${encodeURIComponent(cId)}?month=${month}&year=${year}`
    );
  };

  return {
    activeTab,
    setActiveTab,
    classId,
    className,
    teacherUserId,
    children,
    rows,
    month,
    setMonth,
    year,
    setYear,
    busy,
    successToast,
    msg,
    setMsg,
    fridayData,
    selectedChildIds,
    awarding,
    classDelivery,
    deliveringClass,
    fridayAwardMap,
    loadData,
    toggleSelectChild,
    handleSelectAll,
    handleAwardFriday,
    handleToggleDeliverAllClass,
    rowFor,
    handleOpenChildPage,
  };
}
