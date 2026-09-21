'use client';
import { useState } from 'react';
import { PHOTO_ALBUMS, UNSPLASH } from '../data/mockData';

export default function AlbumPage() {
  const [albums, setAlbums] = useState(PHOTO_ALBUMS);
  const [selected, setSelected] = useState<number | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTag, setNewTag] = useState('');

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    setAlbums(p => [
      ...p,
      {
        id: p.length + 1,
        title: newTitle,
        date: new Date().toLocaleDateString('vi-VN'),
        photos: 0,
        cover: 'outdoor',
        tags: newTag ? [newTag] : [],
      },
    ]);
    setNewTitle('');
    setNewTag('');
    setShowUpload(false);
  };

  const selectedAlbum = albums.find(a => a.id === selected);

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div>
          <h2 className="font-bold text-slate-800 text-xl">📸 Album lớp học</h2>
          <p className="text-sm text-slate-500">Chia sẻ kỷ niệm với phụ huynh</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="ml-auto bg-orange-400 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-500 transition-colors shadow-sm"
        >
          + Thêm album
        </button>
      </div>

      {/* Albums grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {albums.map(album => (
          <button
            key={album.id}
            onClick={() => setSelected(album.id)}
            className="bg-white border border-orange-100 rounded-2xl overflow-hidden text-left card-hover shadow-sm"
          >
            <div className="relative">
              <img
                src={UNSPLASH[album.cover] || UNSPLASH.outdoor}
                alt={album.title}
                className="w-full h-36 object-cover"
              />
              <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                {album.photos} ảnh
              </span>
            </div>
            <div className="p-3">
              <p className="font-bold text-slate-800 text-sm truncate">{album.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{album.date}</p>
              <div className="flex gap-1 mt-2 flex-wrap">
                {album.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 bg-orange-50 text-orange-600 text-xs rounded-full border border-orange-100">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Album detail modal */}
      {selected !== null && selectedAlbum && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex flex-col"
          onClick={() => setSelected(null)}
        >
          {/* Header */}
          <div className="bg-white p-4 flex items-center gap-3 flex-shrink-0" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="text-2xl text-slate-600">←</button>
            <div>
              <h3 className="font-bold text-slate-800">{selectedAlbum.title}</h3>
              <p className="text-sm text-slate-500">{selectedAlbum.photos} ảnh · {selectedAlbum.date}</p>
            </div>
            <button className="ml-auto bg-orange-400 text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-orange-500 transition-colors">
              📤 Chia sẻ với PH
            </button>
          </div>
          {/* Photo grid */}
          <div className="flex-1 overflow-y-auto p-4" onClick={e => e.stopPropagation()}>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: Math.max(9, selectedAlbum.photos) }).map((_, i) => (
                <img
                  key={i}
                  src={`${UNSPLASH[selectedAlbum.cover] || UNSPLASH.outdoor}&sig=${i}`}
                  alt=""
                  className="w-full aspect-square object-cover rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upload modal */}
      {showUpload && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-end"
          onClick={() => setShowUpload(false)}
        >
          <div
            className="bg-white w-full max-w-lg mx-auto rounded-t-3xl p-5 slide-in"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-bold text-slate-800 mb-4 text-lg">Tạo album mới</h3>
            <input
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="w-full border border-orange-200 rounded-xl px-4 py-2.5 text-sm mb-3 focus:outline-none focus:border-orange-400"
              placeholder="Tiêu đề album..."
            />
            <input
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              className="w-full border border-orange-200 rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none focus:border-orange-400"
              placeholder="Nhãn (vd: ngoài trời, nghệ thuật)..."
            />
            <div className="grid grid-cols-2 gap-3 mb-4">
              {['📷 Chụp ảnh', '🖼️ Thư viện', '📁 Máy tính', '🔗 Từ link'].map(opt => (
                <button
                  key={opt}
                  className="p-3 bg-orange-50 border border-orange-200 rounded-xl font-semibold text-orange-700 text-sm hover:bg-orange-100 transition-colors"
                >
                  {opt}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowUpload(false)}
                className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 transition-colors"
              >
                Huỷ
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 bg-orange-400 text-white py-3 rounded-xl font-bold hover:bg-orange-500 transition-colors"
              >
                Tạo album
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
