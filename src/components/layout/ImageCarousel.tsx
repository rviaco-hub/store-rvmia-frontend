import { useEffect, useState } from "react";

interface Props {
  images: string[];
}

export default function ImageCarousel({ images }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length === 0) return;

    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % images.length);
    }, 2500); // cambia cada 2.5s

    return () => clearInterval(interval);
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
        Sin imagen
      </div>
    );
  }

  return (
    <div className="h-40 bg-gray-100 overflow-hidden relative">
      <img
        src={images[index]}
        alt="product"
        className="w-full h-full object-contain transition-all duration-500"
      />
    </div>
  );
}