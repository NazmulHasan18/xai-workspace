export function Logo({ size = 22 }: { size?: number }) {
  // Stands in for the lattice/node mark used across the Figma file's nav + footer
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <circle cx="11" cy="11" r="3" fill="#4FD1C5" />
      <circle cx="4" cy="5" r="1.5" fill="#4FD1C5" fillOpacity="0.5" />
      <circle cx="18" cy="5" r="1.5" fill="#4FD1C5" fillOpacity="0.5" />
      <circle cx="4" cy="17" r="1.5" fill="#4FD1C5" fillOpacity="0.5" />
      <circle cx="18" cy="17" r="1.5" fill="#4FD1C5" fillOpacity="0.5" />
      <line x1="11" y1="11" x2="4" y2="5" stroke="#4FD1C5" strokeWidth="0.8" strokeOpacity="0.4" />
      <line x1="11" y1="11" x2="18" y2="5" stroke="#4FD1C5" strokeWidth="0.8" strokeOpacity="0.4" />
      <line x1="11" y1="11" x2="4" y2="17" stroke="#4FD1C5" strokeWidth="0.8" strokeOpacity="0.4" />
      <line x1="11" y1="11" x2="18" y2="17" stroke="#4FD1C5" strokeWidth="0.8" strokeOpacity="0.4" />
    </svg>
  );
}
