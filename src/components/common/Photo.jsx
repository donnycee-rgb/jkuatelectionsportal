import { useEffect, useState } from 'react';

// A club photograph from config/photos.js, cropped with object-fit: cover.
// If the file has not been supplied yet, a plain neutral panel keeps the
// layout intact. No stand-in imagery is ever generated.
export default function Photo({ photo, className = '', eager = false, sizes, showCaption = false }) {
  const [missing, setMissing] = useState(false);
  useEffect(() => setMissing(false), [photo?.src]);

  if (!photo) return null;

  return (
    <figure className={`photo ${missing ? 'is-missing' : ''} ${className}`}>
      {missing ? (
        <div className="photo-empty" role="img" aria-label={photo.alt}>
          {import.meta.env.DEV && <span className="photo-empty-note">{photo.src.replace('./', 'public/')}</span>}
        </div>
      ) : (
        <img
          src={photo.src}
          alt={photo.alt}
          style={{ objectPosition: photo.position }}
          loading={eager ? 'eager' : 'lazy'}
          fetchpriority={eager ? 'high' : undefined}
          decoding="async"
          sizes={sizes}
          onError={() => setMissing(true)}
        />
      )}
      {showCaption && photo.caption && <figcaption className="photo-caption">{photo.caption}</figcaption>}
    </figure>
  );
}
