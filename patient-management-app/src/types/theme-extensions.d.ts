// Theme extensions to fix property errors related to the Theme type

import '@ltht-react/styles';

// Extend the Theme interface from @ltht-react/styles
declare module '@ltht-react/styles' {
  export interface Theme {
    colors: {
      // Background colors
      background: {
        base: string;
        secondary: string;
        accent: string;
        light: string;
        dark: string;
        highlight: string;
        [key: string]: string;
      };
      
      // Text colors
      text: {
        primary: string;
        secondary: string;
        accent: string;
        light: string;
        dark: string;
        error: string;
        success: string;
        warning: string;
        [key: string]: string;
      };
      
      // Border colors
      border: {
        primary: string;
        secondary: string;
        light: string;
        dark: string;
        [key: string]: string;
      };
      
      // Status colors
      status: {
        success: string;
        warning: string;
        error: string;
        info: string;
        [key: string]: string;
      };
      
      // Button colors
      button: {
        primary: string;
        secondary: string;
        tertiary: string;
        success: string;
        danger: string;
        link: string;
        [key: string]: string;
      };
      
      // Allow any other color categories
      [key: string]: any;
    };
    
    // Spacing system
    spacing: {
      xs: string;
      s: string;
      m: string;
      l: string;
      xl: string;
      xxl: string;
      [key: string]: string;
    };
    
    // Typography system
    typography: {
      fontSize: {
        xs: string;
        s: string;
        m: string;
        l: string;
        xl: string;
        xxl: string;
        [key: string]: string;
      };
      fontWeight: {
        normal: number;
        bold: number;
        [key: string]: number;
      };
      fontFamily: {
        primary: string;
        secondary: string;
        [key: string]: string;
      };
      lineHeight: {
        normal: number;
        tight: number;
        loose: number;
        [key: string]: number;
      };
      [key: string]: any;
    };
    
    // Breakpoints
    breakpoints: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      [key: string]: string;
    };
    
    // Borders
    borders: {
      radius: {
        small: string;
        medium: string;
        large: string;
        [key: string]: string;
      };
      width: {
        thin: string;
        medium: string;
        thick: string;
        [key: string]: string;
      };
      [key: string]: any;
    };
    
    // Shadows
    shadows: {
      small: string;
      medium: string;
      large: string;
      [key: string]: string;
    };
    
    // Allow any other theme properties
    [key: string]: any;
  }
}
