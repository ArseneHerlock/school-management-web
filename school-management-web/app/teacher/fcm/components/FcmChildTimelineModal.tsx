import React from 'react';
import { X, Loader2, TrendingUp } from 'lucide-react';
import { FCM_CLUSTERS } from '@/services/fcm';

interface FcmChildTimelineModalProps {
  selectedChild: any | null;
  onClose: () => void;
  loadingHistory: boolean;
  childHistory: any[];
}

export function FcmChildTimelineModal({
  selectedChild,
  onClose,
  loadingHistory,
  childHistory,
}: FcmChildTimelineModalProps) {
  if (!selectedChild) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 border border-slate-200 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-purple-700">Tiến trình phát triển</span>
            <h3 className="text-base font-black text-slate-900">
              Hồ Sơ Phát Triển: {selectedChild.TenHocSinh}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {loadingHistory ? (
          <div className="py-12 flex items-center justify-center">
            <Loader2 size={24} className="animate-spin text-purple-600" />
          </div>
        ) : childHistory.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            Chưa có dữ liệu lịch sử phân cụm cho học sinh này.
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-extrabold text-slate-700 mb-3 uppercase tracking-wider">
                Lịch sử chuyển biến cụm qua các tháng
              </h4>
              <div className="space-y-3">
                {childHistory.map((h: any) => {
                  const meta = FCM_CLUSTERS[h.ClusterId] || FCM_CLUSTERS[2];

                  return (
                    <div
                      key={h.Id}
                      className="flex items-start gap-4 p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70"
                    >
                      <div className="w-16 shrink-0 text-center">
                        <span className="text-xs font-black text-slate-800 block">Tháng {h.Month}</span>
                        <span className="text-[10px] text-slate-400">{h.Year}</span>
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${meta.badgeBg} ${meta.badgeText}`}>
                            {meta.name}
                          </span>

                          {h.Trend === 'IMPROVED' ? (
                            <span className="text-emerald-700 text-xs font-bold inline-flex items-center gap-1">
                              <TrendingUp size={13} /> Có tiến bộ!
                            </span>
                          ) : null}
                        </div>

                        {h.RadarScores && (
                          <div className="grid grid-cols-5 gap-1 pt-2 text-[10px] text-slate-600">
                            <div>Thể chất: <strong>{h.RadarScores['Thể chất'] || 0}</strong></div>
                            <div>Nhận thức: <strong>{h.RadarScores['Nhận thức'] || 0}</strong></div>
                            <div>Ngôn ngữ: <strong>{h.RadarScores['Ngôn ngữ'] || 0}</strong></div>
                            <div>Xã hội: <strong>{h.RadarScores['Tình cảm - Xã hội'] || 0}</strong></div>
                            <div>Thẩm mĩ: <strong>{h.RadarScores['Thẩm mĩ'] || 0}</strong></div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
