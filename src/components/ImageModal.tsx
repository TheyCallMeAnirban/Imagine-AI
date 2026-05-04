import { X, Download } from "lucide-react";

interface ImageModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export default function ImageModal({ imageUrl, onClose }: ImageModalProps) {
  if (!imageUrl) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative max-w-5xl w-full flex flex-col hard-shadow"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center bg-white border-2 border-black border-b-0 p-3">
          <span className="font-mono text-sm font-bold uppercase tracking-wider">IMAGE_VIEWER.EXE</span>
          <div className="flex gap-4">
            <a 
              href={`/api/download?url=${encodeURIComponent(imageUrl)}`}
              className="hover:text-gray-500 transition-colors"
              title="Download"
            >
              <Download size={20} />
            </a>
            <button onClick={onClose} className="hover:text-gray-500 transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="bg-white border-2 border-black p-4 grainy">
          <img 
            src={imageUrl} 
            alt="Expanded view"
            className="w-full h-auto max-h-[75vh] object-contain border-2 border-black bg-gray-100"
          />
        </div>
      </div>
    </div>
  );
}
