import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const SecurityTheme: ThemeTypes = {
  name: 'SecurityTheme',
  dark: true,
  variables: {
    'border-color': '#1c313a',
    'carousel-control-size': 10
  },
  colors: {
    primary: '#455a64',
    secondary: '#263238',
    info: '#607d8b',
    success: '#4caf50',
    accent: '#ff5722',
    warning: '#ffeb3b',
    error: '#f44336',
    lightprimary: '#cfd8dc',
    lightsecondary: '#eceff1',
    lightsuccess: '#c8e6c9',
    lighterror: '#ffcdd2',
    lightwarning: '#fff9c4',
    darkText: '#212121',
    lightText: '#78909c',
    darkprimary: '#37474f',
    darksecondary: '#212121',
    borderLight: '#90a4ae',
    inputBorder: '#546e7a',
    containerBg: '#cfd8dc',
    surface: '#eceff1',
    'on-surface-variant': '#eceff1',
    facebook: '#4267b2',
    twitter: '#1da1f2',
    linkedin: '#0e76a8',
    gray100: '#f5f5f5',
    primary200: '#90a4ae',
    secondary200: '#78909c'
  }
};

export { SecurityTheme };
