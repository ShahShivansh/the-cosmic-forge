export type SectionId =
  | 'about'
  | 'projects'
  // | 'leadership'
  | 'achievements'
  | 'contact'
  // | 'upcoming';

export interface IslandConfig {
  id: SectionId;
  label: string;
  short: string;
  /** position in the 3D scene */
  position: [number, number, number];
  /** which side, for label placement */
  side: 'left' | 'right';
}

export const ISLANDS: IslandConfig[] = [
  { id: 'about', label: 'About', short: '01', position: [-7.2, 2.1, 0], side: 'left' },
  { id: 'projects', label: 'Projects', short: '02', position: [-8.4, -0.2, 0], side: 'left' },
  // { id: 'leadership', label: 'Leadership', short: '03', position: [-7.0, -2.5, 0], side: 'left' },
  { id: 'achievements', label: 'Achievements', short: '04', position: [7.2, 2.1, 0], side: 'right' },
  { id: 'contact', label: 'Contact Me', short: '05', position: [8.4, -0.2, 0], side: 'right' },
  // { id: 'upcoming', label: 'Upcoming', short: '06', position: [7.0, -2.5, 0], side: 'right' },
];

export const SECTION_ORDER: SectionId[] = [
  'about',
  'projects',
  // 'leadership',
  'achievements',
  'contact',
  // 'upcoming',
];

export const PROFILE = {
  name: 'Shivansh Shah',
  tagline: 'ENGINEER · BUILDER · FOUNDER',
  quote: 'Stillness in thought. Precision in creation.',
};

export const LINKS = {
  github: 'https://github.com/ShahShivansh',
  linkedin: 'https://www.linkedin.com/in/shah-shivansh-06041634a/',
  sihPost:
    'https://www.linkedin.com/posts/shah-shivansh-06041634a_smartindiahackathon-sih2025-nationalwinners-activity-7407820223749447680-QqBr',
};

export interface ProjectBlock {
  name: string;
  blurb: string;
  status?: string;
  current?: string[];
  planned?: string[];
}

export const PROJECTS: ProjectBlock[] = [
  {
    name: 'SmartKheti',
    blurb:
      'Agricultural sensing paired with offline-first software that helps farmers act on local field conditions without constant connectivity.',
    status: 'Prototype',
    current: [
      'Three-in-one soil sensor measuring electrical conductivity, moisture, and temperature.',
      'Weather sensing for ambient temperature, humidity, and rain.',
      'Offline-first local data capture for use in low-connectivity fields.',
    ],
    planned: [
      'Expanded crop advisory and recommendation layer.',
      'Broader sensor coverage and longer-range field deployment.',
    ],
  },
  {
    name: 'Coast Scan',
    blurb:
      'A camera-based approach to mapping beach-sand grain sizes for coastal research, built as part of the Smart India Hackathon 2025 Hardware Edition team.',
    status: 'Team project — SIH 2025 Hardware Edition',
    current: [
      'Camera-based capture workflow for sand specimens.',
      'Analysis pipeline aimed at estimating grain-size distribution.',
    ],
    planned: ['Field validation and research collaboration paths.'],
  },
  {
    name: 'Newsly',
    blurb: 'A multilingual news-platform project exploring accessible, multi-language news delivery.',
    status: 'Concept / in development',
    current: ['Multilingual news reading direction.'],
    planned: ['Further product features under exploration.'],
  },
];
