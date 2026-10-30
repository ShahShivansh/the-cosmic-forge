import { PanelHeader, Pill, LinkButton } from './panelBits';
import { PROJECTS, LINKS } from '../data/portfolio';
import { Github, Linkedin, ExternalLink, Sprout, Waves, Newspaper, Trophy, Compass, Mail, Cpu } from 'lucide-react';

export function AboutPanel() {
  return (
    <div>
      <PanelHeader eyebrow="01 · About" title="A quiet builder at the edge of things" />
      <p className="text-slate-300/90 leading-relaxed mb-4">
        I&apos;m <span className="text-slate-100">Shivansh Shah</span>, a computer science engineering
        student drawn to the places where careful thought meets tangible creation. My interests move
        across <span className="text-cyan-200">AI/ML</span>,{' '}
        <span className="text-cyan-200">embedded systems</span>,{' '}
        <span className="text-cyan-200">IoT</span>,{' '}
        <span className="text-cyan-200">software engineering</span>, and{' '}
        <span className="text-cyan-200">cybersecurity</span>.
      </p>
      <p className="text-slate-400/90 leading-relaxed mb-6">
        I like working at the boundary of hardware and software — sensing the physical world, reasoning
        about it, and building tools that hold up in real conditions. I value stillness in thought and
        precision in creation.
      </p>
      <div className="flex flex-wrap gap-2">
        <Pill>AI / ML</Pill>
        <Pill tone="gold">Embedded Systems</Pill>
        <Pill tone="violet">IoT</Pill>
        <Pill>Software Engineering</Pill>
        <Pill tone="gold">Cybersecurity</Pill>
      </div>
    </div>
  );
}

export function ProjectsPanel() {
  const icons = [Sprout, Waves, Newspaper];
  return (
    <div>
      <PanelHeader eyebrow="02 · Projects" title="Things I have built and am building" />
      <div className="space-y-5">
        {PROJECTS.map((p, i) => {
          const Icon = icons[i];
          return (
            <div
              key={p.name}
              className="cosmic-glass rounded-xl p-4 border border-slate-600/20 hover:border-cyan-400/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-cyan-300">
                  <Icon size={18} />
                </span>
                <h3 className="font-display text-2xl text-slate-100">{p.name}</h3>
                {p.status && <Pill tone={i === 1 ? 'gold' : 'muted'}>{p.status}</Pill>}
              </div>
              <p className="text-slate-300/85 text-sm leading-relaxed mb-3">{p.blurb}</p>
              {p.current && (
                <div className="mb-2">
                  <p className="text-[11px] font-mono-cosmic uppercase tracking-wider text-emerald-300/70 mb-1">
                    Current prototype
                  </p>
                  <ul className="space-y-1">
                    {p.current.map((c) => (
                      <li key={c} className="text-sm text-slate-300/80 flex gap-2">
                        <span className="text-cyan-400/60 mt-1">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {p.planned && (
                <div>
                  <p className="text-[11px] font-mono-cosmic uppercase tracking-wider text-amber-300/70 mb-1">
                    Planned
                  </p>
                  <ul className="space-y-1">
                    {p.planned.map((c) => (
                      <li key={c} className="text-sm text-slate-400/80 flex gap-2">
                        <span className="text-amber-400/50 mt-1">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function LeadershipPanel() {
  return (
    <div>
      <PanelHeader eyebrow="03 · Leadership" title="Collaboration, mentorship, shared problems" />
      <p className="text-slate-300/90 leading-relaxed mb-4">
        I learn most when building with others. Through hackathon teams, class-representative work, and
        group projects, I&apos;ve come to value clear communication, steady ownership, and the kind of
        problem-solving that only happens when a small team trusts each other.
      </p>
      <ul className="space-y-3">
        <li className="cosmic-glass rounded-lg p-3 border border-slate-600/20">
          <p className="text-cyan-200 text-sm font-medium mb-1">Hackathon collaboration</p>
          <p className="text-slate-400/85 text-sm">
            Worked within a hardware-focused team to scope, prototype, and present a camera-based coastal
            research tool under tight time pressure.
          </p>
        </li>
        <li className="cosmic-glass rounded-lg p-3 border border-slate-600/20">
          <p className="text-cyan-200 text-sm font-medium mb-1">Class representative</p>
          <p className="text-slate-400/85 text-sm">
            Acted as a bridge between students and faculty — coordinating feedback, deadlines, and
            academic logistics.
          </p>
        </li>
        <li className="cosmic-glass rounded-lg p-3 border border-slate-600/20">
          <p className="text-cyan-200 text-sm font-medium mb-1">Technical teamwork</p>
          <p className="text-slate-400/85 text-sm">
            Mentoring peers through build decisions — from sensor selection to software architecture —
            and sharing what I learn along the way.
          </p>
        </li>
      </ul>
    </div>
  );
}

export function AchievementsPanel() {
  return (
    <div>
      <PanelHeader eyebrow="04 · Achievements" title="Recognition, earned together" />
      <div className="cosmic-glass rounded-xl p-5 border border-amber-400/20">
        <div className="flex items-start gap-4">
          <span className="text-amber-300 mt-1">
            <Trophy size={22} />
          </span>
          <div>
            <h3 className="font-display text-2xl text-amber-100 mb-1">
              Smart India Hackathon 2025 — Hardware Edition
            </h3>
            <p className="text-amber-200/70 text-sm mb-3">National Winners · Team achievement</p>
            <p className="text-slate-300/85 text-sm leading-relaxed mb-4">
              Part of the team recognized at SIH 2025 Hardware Edition for{' '}
              <span className="text-slate-100">Coast Scan</span> — a camera-based approach to mapping
              beach-sand grain sizes for coastal research. This was a shared team achievement, not an
              individual award.
            </p>
            <LinkButton href={LINKS.sihPost} primary>
              <ExternalLink size={14} /> View the announcement
            </LinkButton>
          </div>
        </div>
      </div>
      <p className="text-slate-500/70 text-xs mt-4 leading-relaxed">
        I only list achievements I can point to. No invented awards, rankings, or certificates.
      </p>
    </div>
  );
}

export function ContactPanel() {
  return (
    <div>
      <PanelHeader eyebrow="05 · Contact Me" title="Step through the gateway" />
      <p className="text-slate-300/90 leading-relaxed mb-6">
        The best way to reach me is through the channels below. I&apos;m open to collaboration on
        hardware, sensing, and software projects.
      </p>
      <div className="space-y-3">
        <LinkButton href={LINKS.github} primary>
          <Github size={16} /> GitHub — @ShahShivansh
        </LinkButton>
        <br />
        <LinkButton href={LINKS.linkedin}>
          <Linkedin size={16} /> LinkedIn — shah-shivansh
        </LinkButton>
      </div>
      <p className="text-slate-500/70 text-xs mt-6 leading-relaxed">
        No email address is listed here to keep this channel intentional. Reach out on LinkedIn.
      </p>
    </div>
  );
}

export function UpcomingPanel() {
  const items = [
    {
      icon: Cpu,
      status: 'Exploring',
      tone: 'cyan' as const,
      title: 'Web3 & smart contracts',
      desc: 'Learning the foundations of decentralized systems and writing small, well-understood smart contracts before building anything ambitious.',
    },
    {
      icon: Compass,
      status: 'In Progress',
      tone: 'violet' as const,
      title: 'Decentralized applications',
      desc: 'Exploring how dApps are structured end-to-end — contracts, clients, and the trust model in between.',
    },
    {
      icon: Mail,
      status: 'Planned',
      tone: 'gold' as const,
      title: 'AI-powered cyber range for students',
      desc: 'A concept for a safe, adaptive environment where students can practice defensive cybersecurity against realistic, AI-driven scenarios.',
    },
  ];
  return (
    <div>
      <PanelHeader eyebrow="06 · Upcoming" title="Directions I am moving toward" />
      <p className="text-slate-400/85 text-sm leading-relaxed mb-5">
        These are explorations, not shipped products. I label them honestly.
      </p>
      <div className="space-y-4">
        {items.map((it) => (
          <div key={it.title} className="cosmic-glass rounded-xl p-4 border border-slate-600/20">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-cyan-300">
                <it.icon size={18} />
              </span>
              <h3 className="font-display text-xl text-slate-100">{it.title}</h3>
              <Pill tone={it.tone}>{it.status}</Pill>
            </div>
            <p className="text-slate-300/85 text-sm leading-relaxed">{it.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export const PANELS = {
  about: AboutPanel,
  projects: ProjectsPanel,
  leadership: LeadershipPanel,
  achievements: AchievementsPanel,
  contact: ContactPanel,
  upcoming: UpcomingPanel,
} as const;
