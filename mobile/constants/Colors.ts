/**
 * Kulu Cash Theme Colors
 * Based on "Horizon Discovery" Design
 */

const tintColorLight = '#0df259';
const tintColorDark = '#0df259';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#f5f8f6',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#0a0f0c',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
  // Custom Design Tokens
  primary: '#0df259', // Neon Green
  background: '#0a0f0c', // Dark Background
  card: '#161e19', // Card Background
  textSecondary: '#64748b', // Slate 500
  glass: 'rgba(10, 15, 12, 0.9)', // For Blur Effects
};
