import { useCallback, useEffect, useRef, useState } from 'react';
import Photo from '../common/Photo.jsx';
import { IconArrowLeft, IconArrowRight, IconPause, IconPlay } from '../common/Icons.jsx';

const INTERVAL = 6500;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Crossfading hero carousel. Autoplay pauses on hover, on keyboard focus,
// when the tab is hidden or the hero is off screen, and never starts when
// the visitor prefers reduced motion. A pause button is always available.
export default function HeroCarousel({ photos }) {
  const count = photos.length;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(() => !prefersReducedMotion());
  const [held, setHeld] = useState(false); // hover / focus inside
  const [visible, setVisible] = useState(true);
  // Only the current and next slides are mounted with a src, so the next
  // photograph is preloaded without fetching the whole set up front.
  const [loaded, setLoaded] = useState(() => new Set([0, 1 % count]));
  const rootRef = useRef(null);

  const go = useCallback((i) => {
    const next = (i + count) % count;
    setIndex(next);
    setLoaded((s) => {
      const n = new Set(s);
      n.add(next);
      n.add((next + 1) % count);
      return n;
    });
  }, [count]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => mq.matches && setPlaying(false);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', onVis); };
  }, []);

  useEffect(() => {
    if (!playing || held || !visible || count < 2) return;
    const t = setTimeout(() => go(index + 1), INTERVAL);
    return () => clearTimeout(t);
  }, [playing, held, visible, index, count, go]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
  };

  if (!count) return null;

  return (
    <section
      ref={rootRef}
      className={`carousel ${playing && !held ? 'is-playing' : ''}`}
      aria-roledescription="carousel"
      aria-label="JKUAT French Club photographs"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setHeld(false); }}
      onKeyDown={onKeyDown}
    >
      <div className="carousel-track" aria-live={playing ? 'off' : 'polite'}>
        {photos.map((p, i) => (
          <div
            key={p.src}
            className={`carousel-slide ${i === index ? 'is-active' : ''}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={i !== index}
          >
            {loaded.has(i) && <Photo photo={p} eager={i === 0} sizes="(min-width: 960px) 55vw, 100vw" />}
          </div>
        ))}
      </div>

      {count > 1 && (
        <div className="carousel-controls">
          <button
            type="button"
            className="carousel-btn carousel-btn--play"
            onClick={() => setPlaying((v) => !v)}
            aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}
          >
            {playing ? <IconPause /> : <IconPlay />}
          </button>
          <div className="carousel-dots" role="group" aria-label="Choose photograph">
            {photos.map((p, i) => (
              <button
                key={p.src}
                type="button"
                className={`carousel-dot ${i === index ? 'is-active' : ''}`}
                onClick={() => go(i)}
                aria-label={`Show photograph ${i + 1} of ${count}`}
                aria-current={i === index ? 'true' : undefined}
              >
                <span style={{ '--slide-dur': `${INTERVAL}ms` }} />
              </button>
            ))}
          </div>
          <div className="carousel-arrows">
            <button type="button" className="carousel-btn" onClick={() => go(index - 1)} aria-label="Previous photograph">
              <IconArrowLeft />
            </button>
            <button type="button" className="carousel-btn" onClick={() => go(index + 1)} aria-label="Next photograph">
              <IconArrowRight />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
