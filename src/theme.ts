import { SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { JetBrainsMono_400Regular, JetBrainsMono_500Medium, JetBrainsMono_600SemiBold, JetBrainsMono_700Bold } from '@expo-google-fonts/jetbrains-mono';

export const fontAssets = {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
  JetBrainsMono_600SemiBold,
  JetBrainsMono_700Bold,
};

export const fonts = {
  grotesk400: 'SpaceGrotesk_400Regular',
  grotesk500: 'SpaceGrotesk_500Medium',
  grotesk600: 'SpaceGrotesk_600SemiBold',
  grotesk700: 'SpaceGrotesk_700Bold',
  mono400: 'JetBrainsMono_400Regular',
  mono500: 'JetBrainsMono_500Medium',
  mono600: 'JetBrainsMono_600SemiBold',
  mono700: 'JetBrainsMono_700Bold',
};

// Default accent — user-selectable in Claude Design (options: blue/lime/gold/violet).
// Kept as a single constant here; wire to a settings screen if that's ever needed.
export const ACCENT = '#2FA9E8';

export const colors = {
  bg: '#08090A',
  bgGradientInner: '#12181B',
  surface: '#14181A',
  surfaceRaised: '#1C2124',
  border: 'rgba(255,255,255,0.07)',
  borderStrong: 'rgba(255,255,255,0.14)',
  borderSubtle: 'rgba(255,255,255,0.1)',
  text: '#F2F5F4',
  textDim: '#DCE3E4',
  mute: '#6E7A7D',
  muteStrong: '#9AA4A7',
  muteFaint: '#596366',
  faintTrack: '#3E4749',
  warm: '#E8894D',
  hot: '#E8574D',
  fairway: '#16261D',
  fairwayLight: '#193024',
  green: '#1E3A29',
  bunker: '#2B2A20',
  rough: '#12201A',
  holeBgTop: '#0E1714',
  holeBgBottom: '#0B1210',
  accentOnBg: '#06181F',
};

export const accentAlpha = (a: number) => `rgba(47,169,232,${a})`;
