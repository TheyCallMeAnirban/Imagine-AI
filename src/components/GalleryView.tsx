import { useEffect, useState } from "react";
import { Download, ExternalLink } from "lucide-react";

interface GalleryImage {
  id: number;
  prompt: string;
  image_url: string;
  created_at: string;
}

interface GalleryViewProps {
  onImageClick?: (url: string) => void;
}

export default function GalleryView({ onImageClick }: GalleryViewProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        setImages(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load gallery:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex-1 p-6 md:p-12 max-w-5xl mx-auto w-full overflow-y-auto">
      <div className="mb-12 border-b-2 border-black pb-6 relative">
        <h1 className="text-4xl font-black font-display tracking-tighter uppercase mb-6">IMAGE GALLERY</h1>
        <div className="border-2 border-black p-4 inline-block hard-shadow relative bg-white">
          <span className="absolute -top-3 -left-3 bg-black text-white font-mono text-xs p-1 px-2">WARNING</span>
          <p className="font-mono text-sm uppercase text-black font-bold">
            MEMORY BUFFER AT 10 UNITS. OLDER GENERATIONS WILL BE PURGED.<br/>
            ARCHIVE LOCALLY TO PREVENT DATA LOSS.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="font-mono text-sm uppercase animate-pulse">Accessing neural archives...</div>
      ) : images.length === 0 ? (
        <div className="font-mono text-sm uppercase text-gray-500">Archive empty. Generate an image first.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {images.map((img) => (
            <div key={img.id} className="border-2 border-black bg-white hard-shadow flex flex-col group">
              <div className="w-full aspect-square relative border-b-2 border-black bg-gray-100 overflow-hidden">
                <img 
                  src={img.image_url} 
                  alt={img.prompt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="font-sans text-sm font-medium line-clamp-3 mb-4">{img.prompt}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-mono text-[10px] text-gray-500">
                    {new Date(img.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onImageClick && onImageClick(img.image_url)}
                      className="p-2 border-2 border-black hover:bg-black hover:text-white transition-colors"
                      title="Open Original"
                    >
                      <ExternalLink size={14} />
                    </button>
                    <a 
                      href={`/api/download?url=${encodeURIComponent(img.image_url)}`} 
                      className="p-2 border-2 border-black bg-black text-white hover:bg-white hover:text-black transition-colors"
                      title="Download"
                    >
                      <Download size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
