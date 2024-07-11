import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const MinimalistTheme: ThemeTypes = {
  name: 'MinimalistTheme',
  dark: false,
  variables: {
    'border-color': '#d3d3d3',
    'carousel-control-size': 10
  },
  colors: {
    primary: '#ffffff',
    secondary: '#c0c0c0',
    info: '#808080',
    success: '#008000',
    accent: '#000000',
    warning: '#ffa500',
    error: '#ff0000',
    lightprimary: '#f5f5f5',
    lightsecondary: '#e0e0e0',
    lightsuccess: '#90ee90',
    lighterror: '#ff7f7f',
    lightwarning: '#ffd700',
    darkText: '#000000',
    lightText: '#808080',
    darkprimary: '#a9a9a9',
    darksecondary: '#696969',
    borderLight: '#d3d3d3',
    inputBorder: '#a9a9a9',
    containerBg: '#f5f5f5',
    surface: '#ffffff',
    'on-surface-variant': '#ffffff',
    facebook: '#4267b2',
    twitter: '#1da1f2',
    linkedin: '#0e76a8',
    gray100: '#f5f5f5',
    primary200: '#e0e0e0',
    secondary200: '#c0c0c0'
  }
};

export { MinimalistTheme };
