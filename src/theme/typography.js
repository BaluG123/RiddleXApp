/**
 * Typography System — Math Master v3.0
 */
import { responsiveFontSize as fs } from 'react-native-responsive-dimensions';

export const Fonts = {
  // Font weights
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
};

export const FontSizes = {
  xs: fs(1.4),
  sm: fs(1.6),
  md: fs(1.8),
  lg: fs(2.2),
  xl: fs(2.8),
  xxl: fs(3.5),
  hero: fs(5),
  display: fs(7),
};

export const TextStyles = {
  hero: {
    fontSize: FontSizes.hero,
    fontWeight: Fonts.extraBold,
    letterSpacing: 1.5,
  },
  heading: {
    fontSize: FontSizes.xxl,
    fontWeight: Fonts.bold,
    letterSpacing: 0.5,
  },
  subheading: {
    fontSize: FontSizes.xl,
    fontWeight: Fonts.semiBold,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: Fonts.semiBold,
  },
  body: {
    fontSize: FontSizes.md,
    fontWeight: Fonts.regular,
    lineHeight: FontSizes.md * 1.5,
  },
  caption: {
    fontSize: FontSizes.sm,
    fontWeight: Fonts.regular,
  },
  tiny: {
    fontSize: FontSizes.xs,
    fontWeight: Fonts.medium,
  },
  button: {
    fontSize: FontSizes.md,
    fontWeight: Fonts.bold,
    letterSpacing: 0.5,
  },
  number: {
    fontSize: FontSizes.display,
    fontWeight: Fonts.bold,
  },
};
