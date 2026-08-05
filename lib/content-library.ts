export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export function getButtonClass(
  style: 'primary' | 'secondary' | 'outline' | 'gradient' | 'glass' = 'primary'
) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-lg font-bold transition-all';

  switch (style) {
    case 'secondary':
    case 'outline':
      return `${base} border-2 border-[var(--primary)] bg-transparent text-[var(--foreground)]`;
    case 'glass':
      return `${base} glass-dark border border-white/30 text-white hover:border-white/50`;
    case 'gradient':
    case 'primary':
    default:
      return `${base} text-white shadow-lg btn-gradient`;
  }
}
