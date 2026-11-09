'use client';

import React, { useState, useEffect, useRef } from 'react';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherName: string;
  teacherRole: string;
  teacherPhone: string;
}

export default function CallModal({
  isOpen,
  onClose,
  teacherName,
  teacherRole,
  teacherPhone,
}: CallModalProps) {
  const [callStatus, setCallStatus] = useState<'ringing' | 'connected'>('ringing');
  const [callSeconds, setCallSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const connectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startRingtone = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      audioCtxRef.current = ctx;
      oscRef.current = osc;
    } catch {
      // Audio playback might be constrained by browser policy
    }
  };

  const stopRingtone = () => {
    try {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
        oscRef.current = null;
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCallStatus('ringing');
      setCallSeconds(0);
      setIsMuted(false);
      setIsSpeakerOn(false);
      startRingtone();

      connectTimeoutRef.current = setTimeout(() => {
        stopRingtone();
        setCallStatus('connected');
        setCallSeconds(1);

        timerRef.current = setInterval(() => {
          setCallSeconds((prev) => prev + 1);
        }, 1000);
      }, 3000);
    } else {
      stopRingtone();
      if (timerRef.current) clearInterval(timerRef.current);
      if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
    }

    return () => {
      stopRingtone();
      if (timerRef.current) clearInterval(timerRef.current);
      if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const mins = String(Math.floor(callSeconds / 60)).padStart(2, '0');
  const secs = String(callSeconds % 60).padStart(2, '0');

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-[80] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl w-full max-w-sm p-6 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
        {/* Background Ambient Glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-sky-500/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>

        {/* Teacher Avatar with Pulse Ring */}
        <div className="relative my-4">
          <div className={`absolute inset-0 rounded-full bg-emerald-500/30 ${callStatus === 'ringing' ? 'pulse-ring' : 'animate-pulse'}`}></div>
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-lg relative z-10 border-4 border-slate-800">
            NL
          </div>
        </div>

        {/* Teacher Name & Info */}
        <h3 className="text-xl font-black mt-2 text-white">{teacherName}</h3>
        <p className="text-xs text-sky-400 font-semibold mt-0.5">{teacherRole}</p>
        <p className="text-xs text-slate-400 mt-1">
          Số điện thoại: <span className="text-slate-200 font-bold">{teacherPhone}</span>
        </p>

        {/* Call Status Badge */}
        <div
          className={`mt-4 px-4 py-1.5 rounded-full border text-xs font-bold ${
            callStatus === 'ringing'
              ? 'bg-slate-800/80 border-slate-700 text-amber-400'
              : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400'
          }`}
        >
          {callStatus === 'ringing' ? (
            <span>Đang đổ chuông...</span>
          ) : (
            <span>
              Đang đàm thoại: <span className="text-slate-200 ml-1.5 font-mono">{mins}:{secs}</span>
            </span>
          )}
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-3 gap-4 w-full mt-7">
          {/* Mute Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              isMuted ? 'text-rose-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className={`w-12 h-12 rounded-full border flex items-center justify-center ${
              isMuted ? 'bg-rose-900/40 border-rose-500/50' : 'bg-slate-800 border-slate-700'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>
              </svg>
            </div>
            <span className="text-[11px] font-semibold">{isMuted ? 'Đã tắt mic' : 'Tắt mic'}</span>
          </button>

          {/* Speaker Button */}
          <button
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              isSpeakerOn ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className={`w-12 h-12 rounded-full border flex items-center justify-center ${
              isSpeakerOn ? 'bg-emerald-900/40 border-emerald-500/50' : 'bg-slate-800 border-slate-700'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              </svg>
            </div>
            <span className="text-[11px] font-semibold">{isSpeakerOn ? 'Đang bật loa' : 'Loa ngoài'}</span>
          </button>

          {/* Direct SIM Call */}
          <a
            href={`tel:${teacherPhone.replace(/\s+/g, '')}`}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><line x1="12" x2="12.01" y1="18" y2="18"/>
              </svg>
            </div>
            <span className="text-[11px] font-semibold">Gọi SIM</span>
          </a>
        </div>

        {/* Hang Up Button */}
        <div className="mt-7 w-full flex items-center justify-center">
          <button
            onClick={onClose}
            className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 transition-transform active:scale-95 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 rotate-[135deg]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </button>
        </div>
        <p className="text-[11px] text-slate-400 mt-2 font-medium">Bấm nút đỏ để kết thúc cuộc gọi</p>
      </div>
    </div>
  );
}
