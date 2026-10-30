import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Scene from './three/Scene';
import Landing from './components/Landing';
import { PANELS } from './components/Panels';
import { ISLANDS, SECTION_ORDER, type SectionId } from './data/portfolio';
import { useReducedMotion } from './hooks/useReducedMotion';
import { X, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export default function App() {
  const [entered, setEntered] = useState(false);
  const [active, setActive] = useState<SectionId | null>(null);
  const [hovered, setHovered] = useState<SectionId | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [webglOk, setWebglOk] = useState(true);
  const reducedMotion = useReducedMotion();
  const audioRef = useRef<{ ctx: AudioContext | null; gain: GainNode | null; nodes: AudioNode[] }>({
    ctx: null,
    gain: null,
    nodes: [],
  });

  useEffect(() => {
    setWebglOk(detectWebGL());
  }, []);

  // Ambient drone via Web Audio — no external assets. Only after enter + opt-in.
  const startAudio = useCallback(() => {
    if (audioRef.current.ctx) return;
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const master = ctx.createGain();
    master.gain.value = 0.0;
    master.connect(ctx.destination);

    const oscs: OscillatorNode[] = [];
    const freqs = [55, 82.5, 110, 165];
    freqs.forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = i % 2 === 0 ? 'sine' : 'triangle';
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.06 / (i + 1);
      // slow shimmer
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.05 + i * 0.03;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.02;
      lfo.connect(lfoGain);
      lfoGain.connect(g.gain);
      o.connect(g);
      g.connect(master);
      o.start();
      lfo.start();
      oscs.push(o);
    });
    master.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 2.5);
    audioRef.current = { ctx, gain: master, nodes: oscs };
  }, []);

  const stopAudio = useCallback(() => {
    const { ctx, gain } = audioRef.current;
    if (ctx && gain) {
      gain.gain.linearRampToValueAtTime(0.0, ctx.currentTime + 0.6);
      setTimeout(() => {
        audioRef.current.nodes.forEach((n) => {
          try {
            (n as OscillatorNode).stop();
          } catch {
            /* noop */
          }
        });
        try {
          ctx.close();
        } catch {
          /* noop */
        }
        audioRef.current = { ctx: null, gain: null, nodes: [] };
      }, 800);
    }
  }, []);

  const handleEnter = useCallback(
    (withSound: boolean) => {
      setEntered(true);
      setSoundOn(withSound);
      if (withSound) startAudio();
    },
    [startAudio],
  );

  const toggleSound = useCallback(() => {
    setSoundOn((s) => {
      const next = !s;
      if (next) startAudio();
      else stopAudio();
      return next;
    });
  }, [startAudio, stopAudio]);

  useEffect(() => {
    return () => stopAudio();
  }, [stopAudio]);

  // Keyboard navigation: Escape closes, arrows move between sections.
  useEffect(() => {
    if (!entered) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActive(null);
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const order = SECTION_ORDER;
        setActive((cur) => {
          if (!cur) return order[0];
          const idx = order.indexOf(cur);
          const nextIdx =
            e.key === 'ArrowRight'
              ? (idx + 1) % order.length
              : (idx - 1 + order.length) % order.length;
          return order[nextIdx];
        });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [entered]);

  const Panel = useMemo(() => (active ? PANELS[active] : null), [active]);

  const activeIndex = active ? SECTION_ORDER.indexOf(active) : -1;

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#04050b]">
      {/* 3D scene / fallback */}
      {webglOk ? (
        <div className="absolute inset-0">
          <Scene
            activeId={active}
            hoveredId={hovered}
            onHover={setHovered}
            onSelect={setActive}
            reducedMotion={reducedMotion}
          />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <div>
            <p className="font-display text-2xl text-slate-200 mb-3">A peaceful sanctuary</p>
            <p className="text-slate-400 max-w-md mx-auto">
              Your browser doesn&apos;t support WebGL, so the 3D cosmos can&apos;t render — but the
              portfolio is still fully explorable through the navigation below.
            </p>
          </div>
        </div>
      )}

      {/* Cinematic vignette */}
      {entered && <div className="cosmic-vignette" />}

      {/* Landing screen */}
      {!entered && <Landing onEnter={handleEnter} />}

      {/* Top bar — appears after entering */}
      {entered && (
        <header className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-5 sm:px-8 py-4 animate-fade">
          <div className="font-display text-lg text-slate-200/90 tracking-wide">
            Shivansh Shah
            <span className="text-cyan-400/60 ml-2 text-xs font-mono-cosmic tracking-[0.3em] uppercase">
              Cosmic Forge
            </span>
          </div>
          <button
            onClick={toggleSound}
            aria-pressed={soundOn}
            aria-label={soundOn ? 'Mute ambient sound' : 'Enable ambient sound'}
            className="focus-ring inline-flex items-center gap-2 px-3 py-2 rounded-full border border-slate-500/30 text-slate-300 hover:border-slate-300/50 hover:bg-slate-500/10 transition-all duration-300 text-sm"
          >
            {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span className="hidden sm:inline">{soundOn ? 'Sound on' : 'Sound off'}</span>
          </button>
        </header>
      )}

      {/* Navigation labels outside the 3D scene */}
      {entered && !active && (
        <nav className="absolute inset-x-0 bottom-0 z-30 px-4 pb-6 animate-fade" aria-label="Section navigation">
          <div className="mx-auto max-w-5xl">
            <p className="text-center text-[11px] font-mono-cosmic tracking-[0.3em] uppercase text-slate-500/70 mb-3">
              Explore the islands
            </p>
            <ul className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {ISLANDS.map((isl) => (
                <li key={isl.id}>
                  <button
                    onClick={() => setActive(isl.id)}
                    onMouseEnter={() => setHovered(isl.id)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(isl.id)}
                    onBlur={() => setHovered(null)}
                    className={`focus-ring group inline-flex items-center gap-2 px-3.5 py-2 rounded-full border text-sm transition-all duration-300 ${
                      hovered === isl.id
                        ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-100'
                        : 'border-slate-600/30 text-slate-300/90 hover:border-slate-400/50 hover:bg-slate-500/10'
                    }`}
                  >
                    <span className="font-mono-cosmic text-[10px] text-slate-500 group-hover:text-cyan-400/70">
                      {isl.short}
                    </span>
                    {isl.label}
                  </button>
                </li>
              ))}
            </ul>
            <p className="text-center text-slate-500/60 text-xs mt-3">
              Click an island or use{' '}
              <kbd className="font-mono-cosmic text-[10px] px-1.5 py-0.5 rounded border border-slate-600/40">
                ←
              </kbd>{' '}
              <kbd className="font-mono-cosmic text-[10px] px-1.5 py-0.5 rounded border border-slate-600/40">
                →
              </kbd>{' '}
              to navigate ·{' '}
              <kbd className="font-mono-cosmic text-[10px] px-1.5 py-0.5 rounded border border-slate-600/40">
                Esc
              </kbd>{' '}
              to return
            </p>
          </div>
        </nav>
      )}

      {/* Content panel overlay */}
      {entered && Panel && active && (
        <div className="absolute inset-0 z-40 flex items-stretch justify-end animate-fade">
          {/* dim backdrop */}
          <button
            aria-label="Close panel and return to the universe"
            onClick={() => setActive(null)}
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label={`${active} section`}
            className="cosmic-glass cosmic-scroll relative w-full sm:max-w-xl md:max-w-2xl h-full overflow-y-auto px-6 sm:px-10 py-8 sm:py-12 border-l border-slate-600/20"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setActive(
                      SECTION_ORDER[
                        (activeIndex - 1 + SECTION_ORDER.length) % SECTION_ORDER.length
                      ],
                    )
                  }
                  aria-label="Previous section"
                  className="focus-ring p-2 rounded-full border border-slate-600/30 text-slate-300 hover:border-slate-300/50 hover:bg-slate-500/10 transition"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() =>
                    setActive(SECTION_ORDER[(activeIndex + 1) % SECTION_ORDER.length])
                  }
                  aria-label="Next section"
                  className="focus-ring p-2 rounded-full border border-slate-600/30 text-slate-300 hover:border-slate-300/50 hover:bg-slate-500/10 transition"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
              <button
                onClick={() => setActive(null)}
                aria-label="Close and return to the universe"
                className="focus-ring p-2 rounded-full border border-slate-600/30 text-slate-300 hover:border-slate-300/50 hover:bg-slate-500/10 transition"
              >
                <X size={18} />
              </button>
            </div>
            <Panel />
            <div className="mt-10 pt-6 border-t border-slate-600/20">
              <button
                onClick={() => setActive(null)}
                className="focus-ring text-sm text-slate-400 hover:text-cyan-200 transition"
              >
                ← Return to the universe
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
