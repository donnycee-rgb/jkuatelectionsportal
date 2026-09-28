// The official club logo, used unaltered. mix-blend-mode: multiply (in CSS)
// lets the logo's white background sit cleanly on the light page tones
// without editing the artwork itself.

export default function Logo({ className = '', size, decorative = false, eager = false }) {
  return (
    <img
      src="./jfc-logo.png"
      width="733"
      height="880"
      className={`logo ${className}`}
      style={size ? { height: size, width: 'auto' } : undefined}
      alt={decorative ? '' : "JKUAT French Club logo, L'Équipe Gagnante"}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}
