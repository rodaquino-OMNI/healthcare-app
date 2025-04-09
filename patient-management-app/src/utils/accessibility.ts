/**
 * Accessibility utility functions for the patient management application
 */

// Keyboard key constants
export enum KeyboardKeys {
  TAB = 'Tab',
  ENTER = 'Enter',
  ESCAPE = 'Escape',
  SPACE = ' ',
  ARROW_UP = 'ArrowUp',
  ARROW_DOWN = 'ArrowDown',
  ARROW_LEFT = 'ArrowLeft',
  ARROW_RIGHT = 'ArrowRight',
  HOME = 'Home',
  END = 'End',
  PAGE_UP = 'PageUp',
  PAGE_DOWN = 'PageDown',
}

// Common ARIA label text
export const ARIA_LABELS = {
  CLOSE: 'Close',
  OPEN: 'Open',
  NAVIGATION: 'Main Navigation',
  CONTENT: 'Main Content',
  REQUIRED: 'This field is required',
  LOADING: 'Loading content, please wait',
  ERROR: 'Error',
  SUCCESS: 'Success',
  PREV: 'Previous',
  NEXT: 'Next',
  MENU: 'Menu',
  SUBMENU: 'Submenu',
};

/**
 * Announce a message to screen readers
 * @param message The message to announce
 * @param assertive If true, the message is announced immediately (use for important messages)
 */
export const announceToScreenReader = (message: string, assertive = false): void => {
  if (!message) return;
  
  // Get existing announcer or create a new one
  let announcer = document.getElementById('screen-reader-announcer');
  
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'screen-reader-announcer';
    announcer.className = 'sr-only';
    announcer.setAttribute('aria-live', assertive ? 'assertive' : 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(announcer);
  }
  
  // Set announcement with a slight delay to ensure screen readers pick up the change
  setTimeout(() => {
    if (announcer) {
      announcer.textContent = message;
    }
  }, 100);
  
  // Clear the announcer after a delay
  setTimeout(() => {
    if (announcer) {
      announcer.textContent = '';
    }
  }, 3000);
};

/**
 * Trap focus within an element (for modals, dialogs, etc.)
 * @param element The element to trap focus within
 * @returns A function to remove the trap
 */
export const trapFocus = (element: HTMLElement): (() => void) => {
  const focusableElements = Array.from(
    element.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => el.tabIndex !== -1);
  
  if (focusableElements.length === 0) return () => {};
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== KeyboardKeys.TAB) return;
    
    // Shift + Tab on first element -> move to last element
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } 
    // Tab on last element -> move to first element
    else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  };
  
  element.addEventListener('keydown', handleKeyDown);
  
  // Return a cleanup function
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
};

/**
 * Setup focus management for an element
 * @param element The element to manage focus within
 * @returns Object with methods to control focus
 */
export const setupFocusManagement = (element: HTMLElement) => {
  const previousFocus = document.activeElement as HTMLElement;
  
  const focusableElements = Array.from(
    element.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => el.tabIndex !== -1);
  
  return {
    /**
     * Focus the first focusable element
     */
    focusFirst: () => {
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        element.focus();
      }
    },
    
    /**
     * Focus a specific element by selector
     * @param selector CSS selector for the element to focus
     */
    focusElement: (selector: string) => {
      const targetElement = element.querySelector<HTMLElement>(selector);
      if (targetElement) {
        targetElement.focus();
      }
    },
    
    /**
     * Restore focus to the element that had focus before this management started
     */
    restoreFocus: () => {
      if (previousFocus && previousFocus.focus) {
        previousFocus.focus();
      }
    },
    
    /**
     * Get all focusable elements within the container
     */
    getFocusableElements: () => focusableElements,
  };
};

/**
 * Check if user prefers reduced motion
 * @returns Boolean indicating if reduced motion is preferred
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Handle ESCAPE key press
 * @param callback Function to call when ESCAPE is pressed
 * @returns A cleanup function to remove the listener
 */
export const handleEscapeKey = (callback: () => void): (() => void) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === KeyboardKeys.ESCAPE) {
      callback();
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
};

/**
 * Generate an ID for accessibility purposes
 * @param prefix A prefix for the ID
 * @returns A unique ID
 */
export const generateAccessibilityId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};