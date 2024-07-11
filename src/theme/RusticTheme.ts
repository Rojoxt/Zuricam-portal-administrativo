import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const RusticTheme: ThemeTypes = {
  name: 'RusticTheme',
  dark: false,
  variables: {
    'border-color': '#8B4513',
    'carousel-control-size': 10
  },
  colors: {
    primary: '#663300',
    secondary: '#CC9900',
    info: '#996633',
    success: '#669966',
    accent: '#CC6600',
    warning: '#FFCC00',
    error: '#CC3300',
    lightprimary: '#E6D5B8',
    lightsecondary: '#F0E6C0',
    lightsuccess: '#B8D9AD',
    lighterror: '#F2C6B4',
    lightwarning: '#FFF6CC',
    darkText: '#000000',
    lightText: '#787878',
    darkprimary: '#331A00',
    darksecondary: '#664D00',
    borderLight: '#A68B60',
    inputBorder: '#3D2918',
    containerBg: '#E6D5B8',
    surface: '#FFFFFF',
    'on-surface-variant': '#FFFFFF',
    facebook: '#4267b2',
    twitter: '#1da1f2',
    linkedin: '#0e76a8',
    gray100: '#F2F2F2',
    primary200: '#CC7A33',
    secondary200: '#E6B800'
  }
};

export { RusticTheme };
