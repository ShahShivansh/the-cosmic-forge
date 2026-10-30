import type { ReactNode } from 'react';

export interface PanelContent {
  id: string;
  eyebrow: string;
  title: string;
  body: ReactNode;
}

/** Shared section header used inside every panel. */
export function PanelHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-6">
      <p className="font-mono-cosmic text-xs tracking-[0.35em] uppercase text-cyan-300/70 mb-2">
        {eyebrow}
      </p>
      <h2 className="font-display text-4xl sm:text-5xl text-cosmic-fade leading-tight">{title}</h2>
    </div>
  );
}

export function Pill({ children, tone = 'cyan' }: { children: ReactNode; tone?: 'cyan' | 'gold' | 'violet' | 'muted' }) {
  const tones: Record<string, string> = {
    cyan: 'border-cyan-400/30 text-cyan-200 bg-cyan-400/5',
    gold: 'border-amber-400/30 text-amber-200 bg-amber-400/5',
    violet: 'border-violet-400/30 text-violet-200 bg-violet-400/5',
    muted: 'border-slate-400/20 text-slate-300 bg-slate-400/5',
  };
  return (
    <span className={`inline-block text-[11px] font-mono-cosmic tracking-wider uppercase px-2.5 py-1 rounded-full border ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function LinkButton({ href, children, primary = false }: { href: string; children: ReactNode; primary?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`focus-ring inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
        primary
          ? 'bg-cyan-400/10 border border-cyan-400/40 text-cyan-100 hover:bg-cyan-400/20 hover:border-cyan-400/70'
          : 'border border-slate-500/30 text-slate-200 hover:border-slate-300/50 hover:bg-slate-500/10'
      }`}
    >
      {children}
    </a>
  );
}
