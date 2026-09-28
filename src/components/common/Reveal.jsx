import { useReveal } from '../../hooks/useReveal.js';

export default function Reveal({ as: Tag = 'div', className = '', children, delay = 0, ...rest }) {
  const ref = useReveal();
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ '--reveal-delay': `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
}
