window.tailwind = window.tailwind || {};
window.tailwind.config = {
  safelist: [
    'bg-paper',
    'bg-paperWarm',
    'bg-ink',
    'bg-markerGreen',
    'bg-markerRed',
    'bg-markerBlue',
    'bg-markerYellow',
    'text-ink',
    'text-paperWarm',
    'border-ink',
    'border-paperWarm',
    'font-museum',
    'font-graphik',
    'font-mono'
  ],
  theme: {
    extend: {
      colors: {
        paper: '#fbede2',
        paperWarm: '#fff7f1',
        ink: '#111111',
        markerGreen: '#8fa689',
        markerRed: '#994e41',
        markerBlue: '#a6bdd4',
        markerYellow: '#f4bb61'
      },
      fontFamily: {
        museum: ['PP Museum', 'Georgia', 'Times New Roman', 'serif'],
        graphik: ['Graphik', 'Arial', 'Helvetica', 'sans-serif'],
        mono: ['iA Writer Quattro', 'Courier New', 'monospace']
      },
      zIndex: {
        80: '80'
      }
    }
  }
};
