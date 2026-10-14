import React, { useRef } from "react";
import { UploadedPhoto } from "../types";
import { Camera, Plus, X, Image as ImageIcon, Receipt, Sparkles, Refrigerator } from "lucide-react";
import { SAMPLE_FRIDGE_PHOTO, SAMPLE_RECEIPT_PHOTO } from "../utils/sampleVisionPhotos";

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

    const availableSlots = 3 - photos.length;
    if (availableSlots <= 0) return;

    const filesToProcess = Array.from(files).slice(0, availableSlots);
    filesToProcess.forEach((file, index) => {
      const isLikelyReceipt = /struk|nota|receipt|kasir|belanja/i.test(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          onAddPhoto({
            id: `upload-${Date.now()}-${index}`,
            url: result,
            label: file.name.replace(/\.[^/.]+$/, "") || (isLikelyReceipt ? "Struk Belanja" : "Foto Kulkas / Dapur"),
            type: isLikelyReceipt ? "receipt" : "fridge"
          });
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (photos.length >= 3) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const availableSlots = 3 - photos.length;
      Array.from(files).slice(0, availableSlots).forEach((file, index) => {
        const isLikelyReceipt = /struk|nota|receipt|kasir|belanja/i.test(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (result) {
            onAddPhoto({
              id: `upload-${Date.now()}-${index}`,
              url: result,
              label: file.name.replace(/\.[^/.]+$/, "") || (isLikelyReceipt ? "Struk Belanja" : "Foto Kulkas"),
              type: isLikelyReceipt ? "receipt" : "fridge"
            });
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleAddSampleFridge = () => {
    if (photos.length >= 3) return;
    const exists = photos.some(p => p.id === SAMPLE_FRIDGE_PHOTO.id);
    if (!exists) {
      onAddPhoto(SAMPLE_FRIDGE_PHOTO);
    }
  };

  const handleAddSampleReceipt = () => {
    if (photos.length >= 3) return;
    const exists = photos.some(p => p.id === SAMPLE_RECEIPT_PHOTO.id);
    if (!exists) {
      onAddPhoto(SAMPLE_RECEIPT_PHOTO);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick Action Presets (Sample Real Photos for Testing Gemini Vision) */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-gradient-to-r from-[#FAF6F0] to-[#F5ECE5] rounded-2xl border border-[#EBE1D7]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C2593F]" />
          <span className="text-xs font-bold text-[#262220]">
            Coba Cepat Deteksi Gemini Vision AI:
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddSampleFridge}
            disabled={photos.length >= 3}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF4F0] text-[#8C3A27] border border-[#E0D5CB] shadow-2xs hover:border-[#C2593F] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="Muat contoh foto rak kulkas nyata"
          >
            <Refrigerator className="w-3.5 h-3.5 text-blue-600" />
            <span>📸 Contoh Foto Kulkas</span>
          </button>
          <button
            type="button"
            onClick={handleAddSampleReceipt}
            disabled={photos.length >= 3}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF4F0] text-[#8C3A27] border border-[#E0D5CB] shadow-2xs hover:border-[#C2593F] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="Muat contoh struk belanja supermarket Super Indo"
          >
            <Receipt className="w-3.5 h-3.5 text-emerald-600" />
            <span>🧾 Contoh Struk Belanja</span>
          </button>
        </div>
      </div>

      {/* Upload Dropzone Box */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => {
          if (photos.length < 3) {
            fileInputRef.current?.click();
          }
        }}
        className={`border-2 border-dashed rounded-2xl p-6 md:p-7 text-center transition-all cursor-pointer ${
          photos.length >= 3
            ? "border-[#EBE6DF] bg-[#FAF8F5] cursor-not-allowed opacity-80"
            : "border-[#DDD7CF] hover:border-[#C2593F] bg-white/80 hover:bg-[#FAF4F0] shadow-xs"
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
          <div className="flex items-center gap-2">
            <div className="w-11 h-11 rounded-2xl bg-[#F7EDE8] text-[#C2593F] flex items-center justify-center shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-xs">
              <Receipt className="w-5 h-5" />
            </div>
          </div>

          <div>
            <p className="text-sm md:text-base font-bold font-serif-editorial text-[#262220]">
              {photos.length >= 3
                ? "Maksimal 3 foto sudah terpenuhi"
                : "Pilih atau Jepret Foto Kulkas / Struk Belanja"}
            </p>
            <p className="text-xs text-[#736B66] mt-0.5 max-w-md mx-auto">
              Gemini Vision AI otomatis mendeteksi bahan dari <strong>foto kulkas berantakan</strong> atau membaca daftar belanjaan dari <strong>struk supermarket / pasar</strong>.
            </p>
          </div>

          {photos.length < 3 && (
            <div className="pt-1 flex items-center gap-2">
              <span className="text-xs font-semibold text-[#8C3A27] bg-[#F9ECE7] border border-[#EDD1C6] px-3.5 py-1.5 rounded-xl hover:bg-[#F2DFD7] transition-colors">
                + Ambil Foto / Unggah Berkas
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Upload status indicator */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-[#736B66]">
          <ImageIcon className="w-3.5 h-3.5 text-[#C2593F]" />
          <span>
            Foto terunggah: <strong className="text-[#262220] font-mono">{photos.length}/3</strong>
          </span>
        </div>
        {photos.length === 0 ? (
          <span className="text-[#8C827A] text-[11px] italic">
            Belum ada foto yang dipilih. Silakan klik tombol contoh di atas atau unggah foto Anda.
          </span>
        ) : (
          <span className="text-emerald-700 font-medium text-[11px] flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Siap dianalisis oleh Gemini Vision AI
          </span>
        )}
      </div>

      {/* Uploaded Photos Preview Thumbnails */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-3 md:gap-4 pt-1">
          {photos.map((photo) => {
            const isReceipt = photo.type === "receipt" || /struk|nota|receipt|belanja/i.test(photo.label);
            return (
              <div
                key={photo.id}
                className="group relative rounded-2xl overflow-hidden border border-[#EBE6DF] bg-stone-900 aspect-square shadow-sm"
              >
                <img
                  src={photo.url}
                  alt={photo.label}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

                {/* Badge for Type */}
                <div className="absolute top-2 left-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-lg backdrop-blur-xs flex items-center gap-1 shadow-xs ${
                      isReceipt
                        ? "bg-emerald-900/85 text-emerald-200 border border-emerald-500/40"
                        : "bg-blue-900/85 text-blue-200 border border-blue-500/40"
                    }`}
                  >
                    {isReceipt ? (
                      <>
                        <Receipt className="w-2.5 h-2.5" />
                        <span>Struk Belanja</span>
                      </>
                    ) : (
                      <>
                        <Refrigerator className="w-2.5 h-2.5" />
                        <span>Foto Kulkas</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Scanning visual overlay when AI Vision is running */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-[#C2593F]/30 backdrop-blur-2xs flex flex-col items-center justify-center p-2 text-center pointer-events-none">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#F5D0B5] to-transparent animate-pulse mb-2" />
                    <span className="text-[10px] font-bold text-white bg-[#262220]/95 px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />
                      <span>{isReceipt ? "Membaca Nota Kasir..." : "Memindai Bahan..."}</span>
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
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/75 hover:bg-[#C2593F] text-white flex items-center justify-center transition-colors shadow-md cursor-pointer"
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
            );
          })}

          {/* Empty slot placeholder if < 3 */}
          {Array.from({ length: 3 - photos.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#DDD7CF] rounded-2xl aspect-square flex flex-col items-center justify-center p-3 text-[#8C827A] hover:border-[#C2593F] hover:text-[#C2593F] cursor-pointer transition-colors bg-[#FAF8F5]"
            >
              <Plus className="w-6 h-6 stroke-[1.5]" />
              <span className="text-[11px] mt-1 font-medium font-mono">
                Slot #{photos.length + i + 1}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
