import SectionHead from '../common/SectionHead.jsx';
import Reveal from '../common/Reveal.jsx';
import Photo from '../common/Photo.jsx';
import { PHOTOS } from '../../config/photos.js';

// An asymmetric arrangement of club photographs. Captions are shown only
// when one has been confirmed in config/photos.js.
export default function Experience() {
  const photos = PHOTOS.experience.slice(0, 4);
  return (
    <section id="experience" className="section section--soft experience" aria-labelledby="experience-title">
      <div className="container">
        <SectionHead
          id="experience-title"
          index="04"
          eyebrow="La vie du club"
          title="The French Club experience"
          lead={<p>The executive serves members brought together by the French language and Francophone culture.</p>}
        />
        <div className="mosaic">
          {photos.map((p, i) => (
            <Reveal key={p.src} variant="image" className={`mosaic-item mosaic-item--${i + 1}`} delay={i * 110}>
              <Photo photo={p} showCaption sizes={i === 0 ? '(min-width: 900px) 58vw, 100vw' : '(min-width: 900px) 40vw, 50vw'} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
