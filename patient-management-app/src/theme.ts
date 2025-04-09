// src/theme.ts - Theme configuration for the application
// Custom theme implementation since @ltht-react/styles doesn't export getTheme

export const theme = {
  colors: {
    background: {
      base: '#ffffff',
      secondary: '#f8f9fa',
      tertiary: '#e9ecef'
    },
    text: {
      primary: '#212529',
      secondary: '#6c757d',
      tertiary: '#adb5bd'
    },
    primary: {
      base: '#0d6efd',
      light: '#0d6efd80',
      dark: '#0a58ca'
    },
    secondary: {
      base: '#6c757d',
      light: '#6c757d80',
      dark: '#5c636a'
    },
    success: {
      base: '#198754',
      light: '#19875480',
      dark: '#146c43'
    },
    danger: {
      base: '#dc3545',
      light: '#dc354580',
      dark: '#b02a37'
    },
    warning: {
      base: '#ffc107',
      light: '#ffc10780',
      dark: '#cc9a06'
    },
    info: {
      base: '#0dcaf0',
      light: '#0dcaf080',
      dark: '#0aa1c0'
    }
  },
  fonts: {
    body: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    heading: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    monospace: 'SFMono-Regular, Menlo, Monaco, Consolas, monospace'
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
    xxl: '2rem'
  },
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    bold: 700
  },
  space: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem'
  },
  radii: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '1rem',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)'
  },
  colorMode: 'light'
};

export default theme;