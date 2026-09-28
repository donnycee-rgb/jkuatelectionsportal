// Simple line icons. No emojis are used anywhere in the interface.

const base = {
  width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round',
  'aria-hidden': true, focusable: 'false',
};

export const IconMenu = () => (<svg {...base}><path d="M4 7h16M4 12h16M4 17h16" /></svg>);
export const IconClose = () => (<svg {...base}><path d="M6 6l12 12M18 6L6 18" /></svg>);
export const IconArrowRight = () => (<svg {...base}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
export const IconArrowLeft = () => (<svg {...base}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>);
export const IconCheck = () => (<svg {...base}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>);
export const IconAlert = () => (<svg {...base}><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5M12 16.5v.01" /></svg>);
export const IconSearch = () => (<svg {...base}><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></svg>);
export const IconDownload = () => (<svg {...base}><path d="M12 4v11M7 10.5l5 5 5-5M5 20h14" /></svg>);
export const IconRefresh = () => (<svg {...base}><path d="M20 11a8 8 0 10-2.3 5.7M20 5v6h-6" /></svg>);
export const IconLock = () => (<svg {...base}><rect x="5" y="10.5" width="14" height="9.5" rx="1.5" /><path d="M8 10.5V8a4 4 0 118 0v2.5" /></svg>);
export const IconPause = () => (<svg {...base}><path d="M9 6v12M15 6v12" /></svg>);
export const IconPlay = () => (<svg {...base}><path d="M8 5.5v13l10.5-6.5z" /></svg>);
export const IconSun = () => (<svg {...base}><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M4.6 4.6L6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4" /></svg>);
export const IconMoon = () => (<svg {...base}><path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" /></svg>);
