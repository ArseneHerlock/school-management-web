'use client';

import React, { useState, useEffect } from 'react';
import { Pill, ShieldAlert, Plus, Info } from 'lucide-react';
import { ChildInfo } from '../types';
import {
  MedicationItem,
  SpecialConditionItem,
  fetchMedications,
  createMedicationRequest,
  fetchSpecialConditions,
  saveSpecialCondition,
} from '@/services/medications';
import { FormThuocState, FormConditionState } from './medications/types';
import { SpecialConditionsSection } from './medications/SpecialConditionsSection';
import { TodayMedicationsSection } from './medications/TodayMedicationsSection';
import { PastMedicationsSection } from './medications/PastMedicationsSection';
import { CreateMedicationModal } from './medications/CreateMedicationModal';
import { SpecialConditionModal } from './medications/SpecialConditionModal';

interface MedicationTabProps {
  child: ChildInfo;
}

export default function MedicationTab({ child }: MedicationTabProps) {
  const childId = child.maHocSinh || child.id;

  const [medications, setMedications] = useState<MedicationItem[]>([]);
  const [conditions, setConditions] = useState<SpecialConditionItem[]>([]);
  const [, setLoading] = useState(true);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isConditionOpen, setIsConditionOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State: Tạo đơn dặn thuốc
  const [formThuoc, setFormThuoc] = useState<FormThuocState>({
    tenThuoc: '',
    lieuLuong: '',
    gioUongDuKien: '11:30 - Sau ăn trưa',
    baoQuan: 'Nhiệt độ phòng',
    loiNhan: '',
    ngayUong: new Date().toISOString().slice(0, 10),
  });

  // Form State: Khai báo bệnh lý đặc biệt
  const [formCondition, setFormCondition] = useState<FormConditionState>({
    loaiBenh: 'TIM_MACH',
    tenBenh: '',
    mucDoNguyHiem: 2,
    luuYVanDong: '',
    luuYAnUong: '',
    phacDoSoCuu: '',
    soDienThoaiKhanCap: '',
    bacSiDieuTri: '',
    ghiChu: '',
  });

  const loadData = async () => {
    if (!childId) return;
    setLoading(true);
    try {
      const [meds, conds] = await Promise.all([
        fetchMedications({ childId, allDates: true }).catch(() => []),
        fetchSpecialConditions({ childId }).catch(() => []),
      ]);
      setMedications(meds);
      setConditions(conds);
    } catch (err) {
      console.error('Error loading medication data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [childId]);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayMeds = medications.filter(
    (m) => m.NgayUong && m.NgayUong.toString().slice(0, 10) === todayStr
  );
  const pastMeds = medications.filter(
    (m) => m.NgayUong && m.NgayUong.toString().slice(0, 10) !== todayStr
  );

  const handleCreateMedication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formThuoc.tenThuoc.trim() || !formThuoc.lieuLuong.trim()) {
      alert('Vui lòng nhập tên thuốc và liều lượng cần cho bé uống.');
      return;
    }

    setSubmitting(true);
    try {
      await createMedicationRequest({
        hocSinhId: childId,
        tenNguoiGui: 'Phụ huynh bé ' + (child.hoTen || ''),
        tenThuoc: formThuoc.tenThuoc.trim(),
        lieuLuong: formThuoc.lieuLuong.trim(),
        gioUongDuKien: formThuoc.gioUongDuKien,
        baoQuan: formThuoc.baoQuan,
        loiNhan: formThuoc.loiNhan.trim(),
        ngayUong: formThuoc.ngayUong,
      });
      setIsCreateOpen(false);
      setFormThuoc({
        tenThuoc: '',
        lieuLuong: '',
        gioUongDuKien: '11:30 - Sau ăn trưa',
        baoQuan: 'Nhiệt độ phòng',
        loiNhan: '',
        ngayUong: new Date().toISOString().slice(0, 10),
      });
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi gửi đơn dặn thuốc.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveCondition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCondition.tenBenh.trim()) {
      alert('Vui lòng nhập tên bệnh lý hoặc tiền sử dị ứng của bé.');
      return;
    }

    setSubmitting(true);
    try {
      await saveSpecialCondition({
        hocSinhId: childId,
        loaiBenh: formCondition.loaiBenh,
        tenBenh: formCondition.tenBenh.trim(),
        mucDoNguyHiem: Number(formCondition.mucDoNguyHiem),
        luuYVanDong: formCondition.luuYVanDong.trim(),
        luuYAnUong: formCondition.luuYAnUong.trim(),
        phacDoSoCuu: formCondition.phacDoSoCuu.trim(),
        soDienThoaiKhanCap: formCondition.soDienThoaiKhanCap.trim(),
        bacSiDieuTri: formCondition.bacSiDieuTri.trim(),
        ghiChu: formCondition.ghiChu.trim(),
      });
      setIsConditionOpen(false);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi lưu thông tin sức khỏe.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 font-sans">
      {/* Top Banner / Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-orange-100 text-orange-600">
              <Pill size={18} />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Chăm Sóc & Y Tế Lớp Học
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800">
            Dặn Thuốc Cho Bé {child.hoTen || ''}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gửi đơn dặn thuốc chi tiết đến giáo viên chủ nhiệm và nhận thông báo xác nhận ngay khi bé được cho uống.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsConditionOpen(true)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50/70 text-rose-700 hover:bg-rose-100 text-xs font-bold transition cursor-pointer"
          >
            <ShieldAlert size={15} />
            <span>Khai báo bệnh nền & Dị ứng</span>
          </button>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition cursor-pointer"
          >
            <Plus size={16} />
            <span>Tạo đơn dặn thuốc</span>
          </button>
        </div>
      </div>

      {/* Safety Policy Notice */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900 leading-relaxed shadow-2xs">
        <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Quy định y tế trường học:</span> Phụ huynh vui lòng chuẩn bị thuốc sẵn và{' '}
          <span className="font-bold">bàn giao trực tiếp cho cô giáo lúc đưa bé đến lớp</span> vào buổi sáng. Nhà trường tuyệt đối không tự ý mua thuốc ngoài hoặc thay đổi liều lượng đã dặn.
        </div>
      </div>

      {/* SECTION 1: Bệnh lý nền & Lưu ý sức khỏe đặc biệt */}
      <SpecialConditionsSection
        conditions={conditions}
        classNameProp={child.lop}
      />

      {/* SECTION 2: Đơn dặn thuốc hôm nay */}
      <TodayMedicationsSection
        todayMeds={todayMeds}
        onOpenCreate={() => setIsCreateOpen(true)}
      />

      {/* SECTION 3: Lịch sử dặn thuốc trước đây */}
      <PastMedicationsSection pastMeds={pastMeds} />

      {/* MODAL: TẠO ĐƠN DẶN THUỐC */}
      <CreateMedicationModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateMedication}
        formThuoc={formThuoc}
        setFormThuoc={setFormThuoc}
        submitting={submitting}
        childName={child.hoTen}
        classNameProp={child.lop}
      />

      {/* MODAL: KHAI BÁO BỆNH LÝ ĐẶC BIỆT */}
      <SpecialConditionModal
        isOpen={isConditionOpen}
        onClose={() => setIsConditionOpen(false)}
        onSubmit={handleSaveCondition}
        formCondition={formCondition}
        setFormCondition={setFormCondition}
        submitting={submitting}
      />
    </div>
  );
}
