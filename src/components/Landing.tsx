import { useState } from 'react';
import { PROFILE } from '../data/portfolio';
import { Volume2, VolumeX, ArrowRight } from 'lucide-react';

interface LandingProps {
  onEnter: (withSound: boolean) => void;
}

export default function Landing({ onEnter }: LandingProps) {
  const [soundOn, setSoundOn] = useState(false);

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center text-center px-6 animate-fade">
      {/* soft radial glow behind the name */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 42%, rgba(40,60,120,0.25) 0%, transparent 55%)',
        }}
      />

      <div className="relative animate-rise">
        <p className="font-mono-cosmic text-[11px] sm:text-xs tracking-[0.5em] uppercase text-cyan-300/60 mb-5">
          The Cosmic Forge
        </p>
        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl text-cosmic-fade leading-[1.05] mb-4">
          {PROFILE.name}
        </h1>
        <p className="font-mono-cosmic text-xs sm:text-sm tracking-[0.4em] uppercase text-slate-400/80 mb-7">
          {PROFILE.tagline}
        </p>
        <p className="font-display italic text-xl sm:text-2xl text-gold-gradient mb-10 max-w-xl mx-auto">
          &ldquo;{PROFILE.quote}&rdquo;
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onEnter(soundOn)}
            className="focus-ring group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-400/10 border border-cyan-400/40 text-cyan-100 hover:bg-cyan-400/20 hover:border-cyan-400/70 transition-all duration-300"
          >
            Enter the Cosmos
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setSoundOn((s) => !s)}
            aria-pressed={soundOn}
            className="focus-ring inline-flex items-center gap-2 px-5 py-3 rounded-full border border-slate-500/30 text-slate-300 hover:border-slate-300/50 hover:bg-slate-500/10 transition-all duration-300"
          >
            {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span className="text-sm">{soundOn ? 'Sound on' : 'Sound off'}</span>
          </button>
        </div>

        <p className="text-slate-500/70 text-xs mt-6 max-w-sm mx-auto leading-relaxed">
          Enter silently, or enable sound first. Sound stays off by default until you choose.
        </p>
      </div>
    </div>
  );
}
