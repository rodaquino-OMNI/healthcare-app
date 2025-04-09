/**
 * Type definitions for @testing-library/jest-dom
 * Extends Jest's expect with DOM-specific matchers
 */

import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      // Add missing matchers from @testing-library/jest-dom
      toHaveTextContent(text: string | RegExp): R;
      toHaveAttribute(attr: string, value?: string | RegExp): R;
      toHaveClass(...classNames: string[]): R;
      toBeInTheDocument(): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toBeEmpty(): R;
      toBeInvalid(): R;
      toBeRequired(): R;
      toBeValid(): R;
      toContainElement(element: HTMLElement | null): R;
      toContainHTML(htmlText: string): R;
      toHaveFocus(): R;
      toHaveFormValues(expectedValues: Record<string, any>): R;
      toHaveStyle(css: string | Record<string, any>): R;
      toHaveValue(value?: string | string[] | number | null): R;
      toBeChecked(): R;
      toBePartiallyChecked(): R;
      toHaveDescription(text: string | RegExp): R;
      toHaveDisplayValue(value: string | RegExp | Array<string | RegExp>): R;
      toHaveErrorMessage(text: string | RegExp): R;
    }
  }
}
