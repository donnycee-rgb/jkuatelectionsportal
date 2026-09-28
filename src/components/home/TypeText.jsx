import { useEffect, useState } from 'react';

// Types a sentence out once. Screen readers get the full text straight away;
// the typed copy is visual only. An invisible full copy reserves the space so
// nothing below it moves. With reduced motion the text simply appears.
export default function TypeText({ text, as: Tag = 'p', className = '', speed = 26, startDelay = 900 }) {
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [count, setCount] = useState(reduce ? text.length : 0);
  const done = count >= text.length;

  useEffect(() => {
    if (reduce) return;
    let i = 0;
    let timer;
    const tick = () => {
      i += 1;
      setCount(i);
      if (i < text.length) timer = setTimeout(tick, speed + (text[i - 1] === ',' || text[i - 1] === '.' ? speed * 6 : 0));
    };
    timer = setTimeout(tick, startDelay);
    return () => clearTimeout(timer);
  }, [text, speed, startDelay, reduce]);

  return (
    <Tag className={`type ${done ? 'is-done' : ''} ${className}`}>
      <span className="visually-hidden">{text}</span>
      <span className="type-ghost" aria-hidden="true">{text}</span>
      <span className="type-live" aria-hidden="true">
        {text.slice(0, count)}
        <span className="type-caret" />
      </span>
    </Tag>
  );
}
