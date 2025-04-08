// React import fixes for TypeScript errors

// This file helps fix issues with React imports and JSX compilation

// Enable default imports from React
declare module 'react' {
  import React from 'react';
  export = React;
  export as namespace React;
}

// Enable JSX without explicit React import (for new JSX transform)
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// Fix for emotion/styled imports
declare module '@emotion/styled' {
  import styled from '@emotion/styled/base';
  export * from '@emotion/styled/base';
  export default styled;
}

// Fix for emotion/react imports
declare module '@emotion/react' {
  export const jsx: any;
  export const css: any;
  export const Global: any;
  export const keyframes: any;
  export const ThemeProvider: any;
  export interface Theme {}
}
