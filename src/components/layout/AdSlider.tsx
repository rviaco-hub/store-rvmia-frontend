import { useEffect, useRef, useState } from "react";
import api from "../../services/api";

interface Slide {
    id: number | string;
    image: string;
    title?: string;
    subtitle?: string;
    link?: string;
}

interface Props {
    fallbackSlides: Slide[];
    interval?: number;
}

export default function AdSlider({
    fallbackSlides,
    interval = 4000,
}: Props) {
    const [slides, setSlides] = useState<Slide[]>(fallbackSlides);
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    // =========================
    // 🔥 CARGAR DESDE BACKEND
    // =========================
    useEffect(() => {
        const fetchAds = async () => {
            try {
                const res = await api.get("/ads");

                const data = Array.isArray(res.data)
                    ? res.data
                    : res.data?.data;

                if (data && data.length > 0) {
                    setSlides(data);
                }
            } catch {
                // fallback automático
                setSlides(fallbackSlides);
            }
        };

        fetchAds();
    }, []);

    // =========================
    // ⏱ AUTO PLAY
    // =========================
    useEffect(() => {
        if (paused) return;

        const timer = setInterval(next, interval);
        return () => clearInterval(timer);
    }, [paused, slides.length]);

    const next = () => {
        setIndex((prev) => (prev + 1) % slides.length);
    };

    const prev = () => {
        setIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    // =========================
    // 👉 SWIPE MOBILE
    // =========================
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        const diff = touchStartX.current - touchEndX.current;

        if (diff > 50) next(); // swipe izquierda
        if (diff < -50) prev(); // swipe derecha
    };

    // =========================
    // 📊 TRACKING
    // =========================
    const trackClick = (slide: Slide) => {
        try {
            api.post("/ads/click", {
                adId: slide.id,
                timestamp: new Date(),
            });
        } catch {
            // opcional: ignorar error
        }
    };

    if (!slides.length) return null;

    return (
        <div
            className="relative overflow-hidden rounded-xl"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* SLIDES FADE */}
            <div className="relative w-full h-[180px] sm:h-[220px] md:h-[260px] lg:h-[300px]">
                {slides.map((slide, i) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-700 ${i === index
                            ? "opacity-100 z-10 pointer-events-auto"
                            : "opacity-0 z-0 pointer-events-none"
                            }`}
                    >
                        <img
                            src={slide.image}
                            alt=""
                            className="w-full h-full object-cover cursor-pointer select-none"
                            onClick={() => {
                                trackClick(slide);
                                if (slide.link) window.open(slide.link, "_blank");
                            }}
                        />

                        {/* Overlay */}
                        {(slide.title || slide.subtitle) && (
                            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-6">
                                {slide.title && (
                                    <h3 className="text-white text-xl sm:text-2xl font-bold">
                                        {slide.title}
                                    </h3>
                                )}
                                {slide.subtitle && (
                                    <p className="text-gray-200 text-sm sm:text-base">
                                        {slide.subtitle}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* BOTONES */}
            <button
                onClick={prev}
                className="z-20 absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
            >
                ←
            </button>

            <button
                onClick={next}
                className="z-20 absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
            >
                →
            </button>

            {/* INDICADORES CLICKABLES */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`h-2 w-2 rounded-full transition ${i === index ? "bg-white scale-110" : "bg-white/40"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}