// Clock modes, mirroring the web app's routes (/clock, /flipboard, ...).
// `ported: false` modes render a placeholder until their visuals are rebuilt for native.
export const MODES = [
  { id: 'clock',     label: 'Simple',    icon: '🕒', ported: true },
  { id: 'flipboard', label: 'Flipboard', icon: '🛫', ported: false },
  { id: 'digital',   label: 'Digital',   icon: '📟', ported: false },
  { id: 'hourglass', label: 'Hourglass', icon: '⏳', ported: false },
  { id: 'win95',     label: 'Win95',     icon: '🪟', ported: false },
]
