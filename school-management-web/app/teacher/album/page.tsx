'use client';
import { useState, useRef } from 'react';
import { CHILDREN, PHOTO_ALBUMS, UNSPLASH } from '../data/mockData';
import Avatar from '../components/Avatar';

// ─── Types ────────────────────────────────────────────────────────────────────

type ClassAlbum = {
  id: number;
  title: string;
  date: string;
  photos: number;
  cover: string;
  tags: string[];
};

type ChildPhoto = {
  id: string;
  childId: number;
  src: string;
  caption: string;
  date: string;
  sessionLabel: string;
};

// Mock child photos
const INIT_CHILD_PHOTOS: ChildPhoto[] = [
  { id:'cp1', childId:1,  src:'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=400&fit=crop&sig=1', caption:'Tranh vẽ gia đình', date:'2026-09-15', sessionLabel:'Tiết tạo hình' },
  { id:'cp2', childId:1,  src:'https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?w=400&h=400&fit=crop&sig=2', caption:'Bức tranh trường mầm non', date:'2026-09-10', sessionLabel:'Tiết tạo hình' },
  { id:'cp3', childId:3,  src:'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=400&fit=crop&sig=3', caption:'Hoa nặn đất sét', date:'2026-09-14', sessionLabel:'Hoạt động thủ công' },
  { id:'cp4', childId:10, src:'https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?w=400&h=400&fit=crop&sig=4', caption:'Tranh màu nước mùa thu', date:'2026-09-15', sessionLabel:'Tiết tạo hình' },
  { id:'cp5', childId:10, src:'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=400&fit=crop&sig=5', caption:'Cắt dán bướm giấy', date:'2026-09-12', sessionLabel:'Hoạt động thủ công' },
  { id:'cp6', childId:6,  src:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&sig=6', caption:'Mô hình nhà từ khối gỗ', date:'2026-09-11', sessionLabel:'Xây dựng sáng tạo' },
  { id:'cp7', childId:13, src:'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=400&fit=crop&sig=7', caption:'Tranh con vật', date:'2026-09-16', sessionLabel:'Tiết tạo hình' },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AlbumPage() {
  const [tab, setTab] = useState<'class' | 'child'>('class');

  // ── Class album state ──
  const [albums, setAlbums] = useState<ClassAlbum[]>(PHOTO_ALBUMS);
  const [selectedAlbum, setSelectedAlbum] = useState<number | null>(null);
  const [showCreateAlbum, setShowCreateAlbum] = useState(false);
  const [showAddClassPhoto, setShowAddClassPhoto] = useState(false);
  const [classPhotoCaption, setClassPhotoCaption] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newTag, setNewTag] = useState('');

  // ── Child portfolio state ──
  const [childPhotos, setChildPhotos] = useState<ChildPhoto[]>(INIT_CHILD_PHOTOS);
  const [selectedChild, setSelectedChild] = useState<number | null>(null);
  const [viewPhoto, setViewPhoto] = useState<ChildPhoto | null>(null);
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [addPhotoChildId, setAddPhotoChildId] = useState<number | null>(null);
  const [newCaption, setNewCaption] = useState('');
  const [newSession, setNewSession] = useState('');
  const [searchChild, setSearchChild] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addClassAlbum = () => {
    if (!newTitle.trim()) return;
    setAlbums(p => [...p, { id: p.length+1, title: newTitle, date: new Date().toLocaleDateString('vi-VN'), photos:0, cover:'outdoor', tags: newTag ? [newTag] : [] }]);
    setNewTitle(''); setNewTag(''); setShowCreateAlbum(false);
  };

  const handleAddChildPhoto = () => {
    if (!addPhotoChildId || !newCaption.trim()) return;
    const now = new Date().toISOString().split('T')[0];
    // Simulate adding a photo (use a placeholder URL since we can't upload real files in demo)
    const colors = ['f97316','ec4899','3b82f6','a855f7','22c55e','f59e0b'];
    const clr = colors[addPhotoChildId % colors.length];
    const newPhoto: ChildPhoto = {
      id: `cp${Date.now()}`,
      childId: addPhotoChildId,
      src: `https://placehold.co/400x400/${clr}/ffffff?text=${encodeURIComponent(newCaption.slice(0,10))}`,
      caption: newCaption,
      date: now,
      sessionLabel: newSession || 'Tiết học',
    };
    setChildPhotos(p => [newPhoto, ...p]);
    setNewCaption(''); setNewSession(''); setShowAddPhoto(false); setAddPhotoChildId(null);
  };

  const selectedAlbumData = albums.find(a => a.id === selectedAlbum);
  const selectedChildData  = CHILDREN.find(c => c.id === selectedChild);
  const selectedChildPhotos = childPhotos.filter(p => p.childId === selectedChild).sort((a,b) => b.date.localeCompare(a.date));

  const filteredChildren = CHILDREN.filter(c =>
    c.nickname.toLowerCase().includes(searchChild.toLowerCase()) ||
    c.name.toLowerCase().includes(searchChild.toLowerCase())
  );

  const photoCountForChild = (id: number) => childPhotos.filter(p => p.childId === id).length;

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4">

      {/* ── Tabs ── */}
      <div className="flex gap-2">
        <button onClick={() => setTab('class')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tab==='class'?'bg-orange-400 text-white shadow-md':'bg-white border border-orange-200 text-orange-600 hover:bg-orange-50'}`}>
          📸 Album lớp
        </button>
        <button onClick={() => setTab('child')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tab==='child'?'bg-orange-400 text-white shadow-md':'bg-white border border-orange-200 text-orange-600 hover:bg-orange-50'}`}>
          🎨 Sản phẩm của bé
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════
          TAB 1 — CLASS ALBUM
         ════════════════════════════════════════════════════════ */}
      {tab === 'class' && !selectedAlbum && (
        <>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <h2 className="font-bold text-slate-800">Album lớp học</h2>
              <p className="text-sm text-slate-500">Chia sẻ kỷ niệm chung với tất cả phụ huynh</p>
            </div>
            <button onClick={() => setShowCreateAlbum(true)}
              className="bg-orange-400 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-500 transition-colors shadow-sm">
              + Tạo album
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {albums.map(album => (
              <button key={album.id} onClick={() => setSelectedAlbum(album.id)}
                className="bg-white border border-orange-100 rounded-2xl overflow-hidden text-left card-hover shadow-sm">
                <div className="relative">
                  <img src={UNSPLASH[album.cover]||UNSPLASH.outdoor} alt={album.title} className="w-full h-36 object-cover" />
                  <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">{album.photos} ảnh</span>
                </div>
                <div className="p-3">
                  <p className="font-bold text-slate-800 text-sm truncate">{album.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{album.date}</p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {album.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 bg-orange-50 text-orange-600 text-xs rounded-full border border-orange-100">{t}</span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Album detail */}
      {tab === 'class' && selectedAlbum && selectedAlbumData && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedAlbum(null)} className="text-2xl text-slate-600">←</button>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800">{selectedAlbumData.title}</h3>
              <p className="text-sm text-slate-500">{selectedAlbumData.photos} ảnh · {selectedAlbumData.date}</p>
            </div>
            <button onClick={() => setShowAddClassPhoto(true)}
              className="bg-white border border-orange-300 text-orange-600 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-orange-50 transition-colors">
              + Thêm ảnh
            </button>
            <button className="bg-orange-400 text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-orange-500 transition-colors">
              📤 Chia sẻ với PH
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: Math.max(0, selectedAlbumData.photos) }).map((_, i) => (
              <img key={i} src={`${UNSPLASH[selectedAlbumData.cover]||UNSPLASH.outdoor}&sig=${i}`} alt=""
                className="w-full aspect-square object-cover rounded-xl cursor-pointer hover:opacity-90 transition-opacity" />
            ))}
            {/* Add photo tile */}
            <button onClick={() => setShowAddClassPhoto(true)}
              className="w-full aspect-square bg-orange-50 border-2 border-dashed border-orange-300 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-orange-100 transition-colors text-orange-500">
              <span className="text-3xl">+</span>
              <span className="text-xs font-semibold">Thêm ảnh</span>
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          TAB 2 — CHILD PORTFOLIO
         ════════════════════════════════════════════════════════ */}
      {tab === 'child' && !selectedChild && (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex gap-2 text-sm text-blue-800">
            <span>🎨</span>
            <span>Mỗi bé có <strong>gallery riêng</strong> — phụ huynh chỉ thấy sản phẩm của con mình.</span>
          </div>

          <input value={searchChild} onChange={e => setSearchChild(e.target.value)}
            placeholder="🔍 Tìm tên bé..."
            className="w-full px-4 py-2.5 bg-white border border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-400" />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredChildren.map(c => {
              const count = photoCountForChild(c.id);
              const lastPhoto = childPhotos.filter(p => p.childId === c.id).sort((a,b) => b.date.localeCompare(a.date))[0];
              return (
                <div key={c.id}
                  className="bg-white border border-orange-100 rounded-2xl overflow-hidden text-left card-hover hover:border-orange-400 transition-all cursor-pointer">
                  {/* Thumbnail — click to open child portfolio */}
                  <div className="relative h-28 bg-orange-50 flex items-center justify-center"
                    onClick={() => setSelectedChild(c.id)}>
                    {lastPhoto ? (
                      <img src={lastPhoto.src} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-1 opacity-40">
                        <span className="text-3xl">🎨</span>
                        <span className="text-xs text-slate-400">Chưa có ảnh</span>
                      </div>
                    )}
                    <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-bold ${count > 0 ? 'bg-orange-400 text-white' : 'bg-slate-200 text-slate-500'}`}>
                      {count} ảnh
                    </span>
                  </div>
                  {/* Footer — click name to open, click + to add photo */}
                  <div className="p-3 flex items-center gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0" onClick={() => setSelectedChild(c.id)}>
                      <Avatar initials={c.avatar} id={c.id} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 text-sm truncate">{c.nickname}</p>
                        <p className="text-xs text-slate-400 truncate">{c.parentName}</p>
                      </div>
                    </div>
                    <button onClick={() => { setAddPhotoChildId(c.id); setShowAddPhoto(true); }}
                      className="w-7 h-7 bg-orange-100 hover:bg-orange-200 rounded-lg flex items-center justify-center text-orange-600 text-sm transition-colors flex-shrink-0">
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Child portfolio detail */}
      {tab === 'child' && selectedChild && selectedChildData && (
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-4 text-white flex items-center gap-3">
            <button onClick={() => setSelectedChild(null)} className="text-xl">←</button>
            <Avatar initials={selectedChildData.avatar} id={selectedChildData.id} size="md" />
            <div className="flex-1">
              <h3 className="font-bold text-lg">{selectedChildData.name}</h3>
              <p className="text-orange-100 text-sm">Phụ huynh: {selectedChildData.parentName} · {selectedChildPhotos.length} sản phẩm</p>
            </div>
            <button onClick={() => { setAddPhotoChildId(selectedChild); setShowAddPhoto(true); }}
              className="bg-white/20 hover:bg-white/30 px-3 py-2 rounded-xl text-sm font-bold transition-colors">
              + Thêm ảnh
            </button>
          </div>

          {/* Parent-view note */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2">
            <span>👨‍👩‍👦</span>
            <p className="text-sm text-amber-800 flex-1">Phụ huynh <strong>{selectedChildData.parentName}</strong> chỉ thấy gallery của bé <strong>{selectedChildData.nickname}</strong>.</p>
            <button className="text-xs bg-amber-400 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-amber-500 transition-colors">
              📤 Gửi cho PH
            </button>
          </div>

          {selectedChildPhotos.length === 0 ? (
            <div className="bg-white border border-orange-100 rounded-2xl p-10 text-center">
              <p className="text-4xl mb-3">🎨</p>
              <p className="text-slate-500 font-semibold mb-4">Chưa có sản phẩm nào của bé {selectedChildData.nickname}</p>
              <button onClick={() => { setAddPhotoChildId(selectedChild); setShowAddPhoto(true); }}
                className="bg-orange-400 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-orange-500 transition-colors">
                + Thêm ảnh đầu tiên
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {selectedChildPhotos.map(photo => (
                <button key={photo.id} onClick={() => setViewPhoto(photo)}
                  className="bg-white border border-orange-100 rounded-2xl overflow-hidden text-left card-hover hover:border-orange-400 transition-all">
                  <img src={photo.src} alt={photo.caption} className="w-full h-36 object-cover" />
                  <div className="p-2.5">
                    <p className="text-xs font-bold text-slate-700 truncate">{photo.caption}</p>
                    <p className="text-xs text-orange-500 font-semibold">{photo.sessionLabel}</p>
                    <p className="text-xs text-slate-400" suppressHydrationWarning>
                      {new Date(photo.date).toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit' })}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Photo fullscreen modal ── */}
      {viewPhoto && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col" onClick={() => setViewPhoto(null)}>
          <div className="flex items-center gap-3 p-4 flex-shrink-0" onClick={e => e.stopPropagation()}>
            <button onClick={() => setViewPhoto(null)} className="text-white text-2xl">←</button>
            <div>
              <p className="text-white font-bold">{viewPhoto.caption}</p>
              <p className="text-slate-400 text-sm">{viewPhoto.sessionLabel} · <span suppressHydrationWarning>{new Date(viewPhoto.date).toLocaleDateString('vi-VN')}</span></p>
            </div>
            <button className="ml-auto bg-orange-400 text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-orange-500">📤 Gửi PH</button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4" onClick={e => e.stopPropagation()}>
            <img src={viewPhoto.src} alt={viewPhoto.caption} className="max-h-full max-w-full rounded-2xl object-contain" />
          </div>
        </div>
      )}

      {/* ── Create class album modal ── */}
      {showCreateAlbum && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end" onClick={() => setShowCreateAlbum(false)}>
          <div className="bg-white w-full max-w-lg mx-auto rounded-t-3xl p-5 slide-in" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-slate-800 text-lg mb-4">📸 Tạo album lớp mới</h3>
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)}
              className="w-full border border-orange-200 rounded-xl px-4 py-2.5 text-sm mb-3 focus:outline-none focus:border-orange-400"
              placeholder="Tiêu đề album..." autoFocus />
            <input value={newTag} onChange={e => setNewTag(e.target.value)}
              className="w-full border border-orange-200 rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none focus:border-orange-400"
              placeholder="Nhãn (VD: ngoài trời, nghệ thuật)..." />
            <div className="flex gap-2">
              <button onClick={() => setShowCreateAlbum(false)} className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-500">Huỷ</button>
              <button onClick={addClassAlbum} className="flex-1 bg-orange-400 text-white py-3 rounded-xl font-bold hover:bg-orange-500 transition-colors">Tạo album</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add photos to class album modal ── */}
      {showAddClassPhoto && selectedAlbum && selectedAlbumData && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end" onClick={() => setShowAddClassPhoto(false)}>
          <div className="bg-white w-full max-w-lg mx-auto rounded-t-3xl p-5 slide-in" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-slate-800 text-lg mb-1">📷 Thêm ảnh vào album</h3>
            <p className="text-sm text-slate-500 mb-4">{selectedAlbumData.title}</p>
            <div className="border-2 border-dashed border-orange-200 rounded-xl p-6 text-center mb-4 bg-orange-50 hover:border-orange-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}>
              <p className="text-4xl mb-2">📷</p>
              <p className="text-sm font-semibold text-orange-600">Nhấn để chọn ảnh</p>
              <p className="text-xs text-slate-400 mt-1">Chọn nhiều ảnh cùng lúc · JPG, PNG, WEBP</p>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" />
            <input value={classPhotoCaption} onChange={e => setClassPhotoCaption(e.target.value)}
              className="w-full border border-orange-200 rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none focus:border-orange-400"
              placeholder="Ghi chú cho ảnh (tuỳ chọn)..." />
            <div className="grid grid-cols-3 gap-2 mb-4">
              {['📷 Chụp ảnh', '🖼️ Thư viện', '📁 Máy tính'].map(opt => (
                <button key={opt} className="p-2.5 bg-orange-50 border border-orange-200 rounded-xl text-xs font-semibold text-orange-700 hover:bg-orange-100 transition-colors">
                  {opt}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setShowAddClassPhoto(false); setClassPhotoCaption(''); }}
                className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-500">Huỷ</button>
              <button onClick={() => {
                setAlbums(p => p.map(a => a.id === selectedAlbum ? { ...a, photos: a.photos + 3 } : a));
                setShowAddClassPhoto(false); setClassPhotoCaption('');
              }} className="flex-1 bg-orange-400 text-white py-3 rounded-xl font-bold hover:bg-orange-500 transition-colors">
                💾 Lưu ảnh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add child photo modal ── */}
      {showAddPhoto && addPhotoChildId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end" onClick={() => setShowAddPhoto(false)}>
          <div className="bg-white w-full max-w-lg mx-auto rounded-t-3xl p-5 slide-in" onClick={e => e.stopPropagation()}>
            {(() => {
              const child = CHILDREN.find(c => c.id === addPhotoChildId)!;
              return (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar initials={child.avatar} id={child.id} size="sm" />
                    <h3 className="font-bold text-slate-800 text-lg">Thêm sản phẩm — {child.nickname}</h3>
                  </div>

                  {/* Upload area */}
                  <div className="border-2 border-dashed border-orange-200 rounded-xl p-6 text-center mb-4 bg-orange-50 hover:border-orange-400 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}>
                    <p className="text-3xl mb-2">📷</p>
                    <p className="text-sm font-semibold text-orange-600">Nhấn để chọn ảnh</p>
                    <p className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP</p>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />

                  <input value={newCaption} onChange={e => setNewCaption(e.target.value)}
                    className="w-full border border-orange-200 rounded-xl px-4 py-2.5 text-sm mb-3 focus:outline-none focus:border-orange-400"
                    placeholder="Tên sản phẩm (VD: Tranh vẽ mùa hè)..." />
                  <input value={newSession} onChange={e => setNewSession(e.target.value)}
                    className="w-full border border-orange-200 rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none focus:border-orange-400"
                    placeholder="Tiết học (VD: Tiết tạo hình, Thủ công)..." />

                  <div className="flex gap-2">
                    <button onClick={() => { setShowAddPhoto(false); setAddPhotoChildId(null); }}
                      className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-500">Huỷ</button>
                    <button onClick={handleAddChildPhoto} disabled={!newCaption.trim()}
                      className="flex-1 bg-orange-400 text-white py-3 rounded-xl font-bold hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      💾 Lưu sản phẩm
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
