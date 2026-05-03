import { useEffect, useState } from "react";

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
}

export default function AdSlider({
  fallbackSlides
}: {
  fallbackSlides: Slide[];
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const i = setInterval(() => {
      setIndex(prev => (prev + 1) % fallbackSlides.length);
    }, 3500);

    return () => clearInterval(i);
  }, []);

  return (
    <div className="slider-wrapper">
      {fallbackSlides.map((slide, i) => (
        <div
          key={slide.id}
          className={`slide ${i === index ? "active" : ""}`}
        >
          <img src={slide.image} />

          <div className="overlay">
            <h1>{slide.title}</h1>
            <p>{slide.subtitle}</p>
            <button>Comprar</button>
          </div>
        </div>
      ))}
    </div>
  );
}