export const THEMES = {
  serika: {
    name: 'Serika Dark',
    bg: '#323437',
    panel: '#2c2e31',
    border: '#3b3d41',
    text: '#646669',
    main: '#e2b714',
    sub: '#d1d0c5',
    error: '#ca4754',
  },
  nord: {
    name: 'Nord',
    bg: '#2e3440',
    panel: '#3b4252',
    border: '#434c5e',
    text: '#4c566a',
    main: '#88c0d0',
    sub: '#eceff4',
    error: '#bf616a',
  },
  matrix: {
    name: 'Matrix',
    bg: '#0d1117',
    panel: '#161b22',
    border: '#21262d',
    text: '#238636',
    main: '#00ff66',
    sub: '#c9d1d9',
    error: '#ff3333',
  },
  monocle: {
    name: 'Monocle',
    bg: '#121212',
    panel: '#1e1e1e',
    border: '#2a2a2a',
    text: '#555555',
    main: '#ffffff',
    sub: '#dddddd',
    error: '#ff4444',
  },
  cyberpunk: {
    name: 'Cyberpunk',
    bg: '#140c1c',
    panel: '#1f132b',
    border: '#2d1c3f',
    text: '#624c80',
    main: '#ff007f',
    sub: '#e0c4ff',
    error: '#ff3300',
  },
  dracula: {
    name: 'Dracula',
    bg: '#282a36',
    panel: '#21222c',
    border: '#44475a',
    text: '#6272a4',
    main: '#bd93f9',
    sub: '#f8f8f2',
    error: '#ff5555',
  },
  gruvbox: {
    name: 'Gruvbox',
    bg: '#282828',
    panel: '#1d2021',
    border: '#3c3836',
    text: '#665c54',
    main: '#fe8019',
    sub: '#ebdbb2',
    error: '#fb4934',
  },
  solarized: {
    name: 'Solarized',
    bg: '#002b36',
    panel: '#073642',
    border: '#094959',
    text: '#586e75',
    main: '#b58900',
    sub: '#93a1a1',
    error: '#dc322f',
  },
  carbon: {
    name: 'Carbon',
    bg: '#161616',
    panel: '#1c1c1c',
    border: '#262626',
    text: '#525252',
    main: '#0f62fe',
    sub: '#c6c6c6',
    error: '#da1e28',
  },
  rosepine: {
    name: 'Rosé Pine',
    bg: '#191724',
    panel: '#1f1d2e',
    border: '#26233a',
    text: '#524f67',
    main: '#c4a7e7',
    sub: '#e0def4',
    error: '#eb6f92',
  },
  catppuccin: {
    name: 'Catppuccin',
    bg: '#1e1e2e',
    panel: '#181825',
    border: '#313244',
    text: '#585b70',
    main: '#cba6f7',
    sub: '#cdd6f4',
    error: '#f38ba8',
  },
  tokyonight: {
    name: 'Tokyo Night',
    bg: '#1a1b26',
    panel: '#16161e',
    border: '#292e42',
    text: '#565f89',
    main: '#7aa2f7',
    sub: '#a9b1d6',
    error: '#f7768e',
  },
  paper: {
    name: 'Paper',
    bg: '#eeeeee',
    panel: '#e0e0e0',
    border: '#c8c8c8',
    text: '#999999',
    main: '#444444',
    sub: '#222222',
    error: '#cc3333',
  },
  olivia: {
    name: 'Olivia',
    bg: '#1c1b1d',
    panel: '#242325',
    border: '#332f33',
    text: '#4c4348',
    main: '#deaf9d',
    sub: '#dbd0ca',
    error: '#a13d3d',
  },
};

export const ThemeService = {
  applyTheme(themeKey) {
    const theme = THEMES[themeKey] || THEMES.serika;
    const root = document.documentElement;
    root.style.setProperty('--bg-color', theme.bg);
    root.style.setProperty('--panel-color', theme.panel);
    root.style.setProperty('--border-color', theme.border);
    root.style.setProperty('--text-color', theme.text);
    root.style.setProperty('--main-color', theme.main);
    root.style.setProperty('--sub-color', theme.sub);
    root.style.setProperty('--error-color', theme.error);
  },
  getTheme(themeKey) {
    return THEMES[themeKey] || THEMES.serika;
  }
};
