import { useReveal } from '../../hooks/useReveal.js';

// variant: 'rise' (fade + slide up, default) or 'image' (clip reveal for photographs).
export default function Reveal({ as: Tag = 'div', className = '', variant = 'rise', children, delay = 0, style, ...rest }) {
  const ref = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal reveal--${variant} ${className}`}
      style={{ '--reveal-delay': `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
