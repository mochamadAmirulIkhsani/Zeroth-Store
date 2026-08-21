import { useRef, useEffect, useState } from 'react';
import { Star } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  gameId: string;
  service: string;
  rating: number;
  content: string;
  avatar?: string;
}

interface Game {
  id: string;
  name: string;
  color?: string;
}

interface Props {
  testimonials: Testimonial[];
  games: Game[];
  dark?: boolean;
}

export function TestimonialsCarousel({ testimonials, games, dark = false }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const animFrameRef = useRef<number>();
  const posRef = useRef(0);
  const speed = 0.5;

  const items = [...testimonials, ...testimonials, ...testimonials];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let rowWidth = 0;

    const init = () => {
      const children = track.children;
      const itemCount = children.length / 3;
      let w = 0;
      for (let i = 0; i < itemCount; i++) {
        const el = children[i] as HTMLElement;
        w += el.offsetWidth + 24;
      }
      rowWidth = w;
    };

    const raf = requestAnimationFrame(init);

    const animate = () => {
      if (!paused) {
        posRef.current -= speed;
        if (rowWidth > 0 && posRef.current <= -rowWidth) {
          posRef.current += rowWidth;
        }
        track.style.transform = `translateX(${posRef.current}px)`;
      }
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(raf);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [paused, testimonials.length]);

  const Card = ({ t }: { t: Testimonial }) => {
    const game = games.find(g => g.id === t.gameId);
    return dark ? (
      <div
        className="flex-shrink-0 w-72 rounded-2xl p-5 select-none transition-all duration-200"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, j) => (
              <Star key={j} className={`w-3.5 h-3.5 ${j < t.rating ? 'text-amber-400 fill-amber-400' : ''}`}
                style={j >= t.rating ? { color: 'rgba(255,255,255,0.12)' } : {}} />
            ))}
          </div>
          {game && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: `${game.color}18`, color: game.color, border: `1px solid ${game.color}28` }}>
              {game.name}
            </span>
          )}
        </div>
        <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: 'rgba(255,255,255,0.55)' }}>"{t.content}"</p>
        <div className="flex items-center gap-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.08)' }}>
            {t.avatar ? (
              <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>{t.name[0]}</span>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{t.name}</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{game?.name}{t.service ? ` — ${t.service}` : ''}</p>
          </div>
        </div>
      </div>
    ) : (
      <div className="flex-shrink-0 w-72 bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-md rounded-2xl p-5 transition-all duration-200 select-none">
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, j) => (
            <Star key={j} className={`w-3.5 h-3.5 ${j < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
          ))}
        </div>
        <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">"{t.content}"</p>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            {t.avatar ? (
              <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs font-medium">{t.name[0]}</div>
            )}
          </div>
          <div>
            <p className="font-medium text-[#0A0A0A] text-sm">{t.name}</p>
            <p className="text-gray-400 text-xs">{game?.name}{t.service ? ` — ${t.service}` : ''}</p>
          </div>
        </div>
      </div>
    );
  };

  if (testimonials.length === 0) return null;

  const fadeColor = dark ? '#0A0A0A' : '#ffffff';

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div ref={trackRef} className="flex gap-6 w-max will-change-transform">
        {items.map((t, i) => (
          <Card key={`${t.id}-${i}`} t={t} />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10"
        style={{ background: `linear-gradient(to right, ${fadeColor}, transparent)` }} />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10"
        style={{ background: `linear-gradient(to left, ${fadeColor}, transparent)` }} />
    </div>
  );
}
