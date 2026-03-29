import tokens from './tokens/design-tokens.json';

const nextFont = (tokens.typography as Record<string, string>);
const colors = {
  surface: tokens.semantic.surface,
  text: tokens.semantic.text,
  accent: tokens.semantic.accent,
  status: tokens.semantic.status,
  nightSafe: tokens.semantic.nightSafe,
};

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors,
      fontFamily: {
        display: [nextFont.display],
        body: [nextFont.body],
        mono: [nextFont.mono],
      },
      spacing: {
        section: tokens.spacing.section,
        gutter: tokens.spacing.gutter,
        card: tokens.spacing.card,
        stack: tokens.spacing.stack,
      },
      borderRadius: {
        panel: tokens.radii.panel,
        pill: tokens.radii.pill,
      },
      boxShadow: {
        soft: tokens.shadows.soft,
        night: tokens.shadows.night,
      },
      backgroundImage: {
        'desert-glow': 'linear-gradient(135deg, rgba(238, 211, 153, 0.95), rgba(211, 161, 99, 0.75), rgba(84, 45, 20, 0.88))',
        'night-horizon': 'linear-gradient(180deg, rgba(49, 103, 174, 0.9), rgba(29, 32, 31, 0.98))',
      },
    },
  },
  plugins: [],
};
