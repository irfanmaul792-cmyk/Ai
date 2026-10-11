import React, { useRef } from 'react';
import { UploadedPhoto } from '../types';
import { Camera, Plus, X, Image as ImageIcon } from 'lucide-react';

interface PhotoUploaderProps {
  photos: UploadedPhoto[];
  onAddPhoto: (photo: UploadedPhoto) => void;
  onRemovePhoto: (id: string) => void;
  isAnalyzing?: boolean;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  photos,
  onAddPhoto,
  onRemovePhoto,
  isAnalyzing = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Remaining slots (max 3)
    const availableSlots = 3 - photos.length;
    if (availableSlots <= 0) return;

    const filesToProcess = Array.from(files).slice(0, availableSlots);

    filesToProcess.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          onAddPhoto({
            id: `upload-${Date.now()}-${index}`,
            url: result,
            label: file.name.replace(/\.[^/.]+$/, "") || 'Foto Kulkas / Dapur',
          });
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (photos.length >= 3) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const availableSlots = 3 - photos.length;
      Array.from(files).slice(0, availableSlots).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (result) {
            onAddPhoto({
              id: `upload-${Date.now()}-${index}`,
              url: result,
              label: file.name.replace(/\.[^/.]+$/, "") || 'Foto Kulkas',
            });
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Dropzone Box */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => {
          if (photos.length < 3) {
            fileInputRef.current?.click();
          }
        }}
        className={`border-2 border-dashed rounded-2xl p-6 md:p-8 text-center transition-all cursor-pointer ${
          photos.length >= 3
            ? 'border-stone-300 bg-stone-50/50 cursor-not-allowed opacity-80'
            : 'border-stone-300 hover:border-emerald-600 bg-white/70 hover:bg-emerald-50/20 shadow-sm'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
          disabled={photos.length >= 3}
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm md:text-base font-semibold text-stone-900">
              {photos.length >= 3
                ? 'Maksimal 3 foto sudah terpenuhi'
                : 'Pilih atau ambil foto (maksimal 3)'}
            </p>
            <p className="text-xs text-stone-500 mt-0.5">
              Contoh: rak kulkas, freezer, meja dapur, atau bahan belanjaan
            </p>
          </div>

          {photos.length < 3 && (
            <div className="pt-2 flex items-center gap-2">
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
                + Klik untuk Unggah / Jepret Kamera
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Upload status indicator */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-stone-500">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Foto terunggah: <strong className="text-stone-800 font-mono">{photos.length}/3</strong></span>
        </div>
        {photos.length === 0 && (
          <span className="text-stone-400 text-[11px] italic">
            Belum ada foto yang dipilih
          </span>
        )}
      </div>

      {/* Uploaded Photos Preview Thumbnails */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-3 md:gap-4 pt-1">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-900 aspect-square shadow-sm"
            >
              <img
                src={photo.url}
                alt={photo.label}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

              {/* Scanning visual overlay when AI Vision is running */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-blue-500/20 flex flex-col items-center justify-center p-2 text-center pointer-events-none">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse mb-2" />
                  <span className="text-[10px] font-bold text-white bg-blue-900/90 px-2 py-0.5 rounded shadow">
                    🔍 Memindai Bahan...
                  </span>
                </div>
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemovePhoto(photo.id);
                }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/75 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-md"
                title="Hapus foto ini"
                aria-label={`Hapus ${photo.label}`}
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              {/* Photo label caption */}
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-[11px] font-medium text-white truncate drop-shadow">
                  {photo.label}
                </p>
              </div>
            </div>
          ))}

          {/* Empty slot placeholder if < 3 */}
          {Array.from({ length: 3 - photos.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-200 rounded-2xl aspect-square flex flex-col items-center justify-center p-3 text-stone-400 hover:border-emerald-400 hover:text-emerald-600 cursor-pointer transition-colors bg-stone-50/50"
            >
              <Plus className="w-6 h-6 stroke-[1.5]" />
              <span className="text-[11px] mt-1 font-medium">Slot Foto #{photos.length + i + 1}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
