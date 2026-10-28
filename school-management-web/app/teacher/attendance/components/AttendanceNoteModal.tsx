'use client'

import React from 'react'

interface AttendanceNoteModalProps {
  childName?: string
  tempNote: string
  setTempNote: (n: string) => void
  onClose: () => void
  onSave: () => void
}

export const AttendanceNoteModal: React.FC<AttendanceNoteModalProps> = ({
  childName,
  tempNote,
  setTempNote,
  onClose,
  onSave,
}) => {
  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-end"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg mx-auto rounded-t-3xl p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-bold text-slate-800 mb-3">
          Ghi chú — {childName}
        </h3>
        <textarea
          value={tempNote}
          onChange={(e) => setTempNote(e.target.value)}
          className="w-full border border-orange-200 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-400 resize-none"
          rows={3}
          placeholder="Lý do vắng mặt / đi trễ..."
        />
        <div className="flex gap-2 mt-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={onSave}
            className="flex-1 bg-orange-400 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-orange-500 cursor-pointer"
          >
            Lưu ghi chú
          </button>
        </div>
      </div>
    </div>
  )
}
