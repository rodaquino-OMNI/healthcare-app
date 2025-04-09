/**
 * Type definitions for @testing-library/jest-dom
 * Extends Jest's expect with DOM-specific matchers
 */

// This file is a type declaration file for @testing-library/jest-dom
// It extends the Jest namespace to include the custom matchers provided by jest-dom

declare namespace jest {
  interface Matchers<R> {
    // DOM Testing Library matchers
    toBeInTheDocument(): R;
    toBeVisible(): R;
    toBeEmpty(): R;
    toBeDisabled(): R;
    toBeEnabled(): R;
    toBeInvalid(): R;
    toBeRequired(): R;
    toBeValid(): R;
    toContainElement(element: HTMLElement | null): R;
    toContainHTML(htmlText: string): R;
    toHaveAttribute(attr: string, value?: string | RegExp): R;
    toHaveClass(...classNames: string[]): R;
    toHaveFocus(): R;
    toHaveFormValues(expectedValues: Record<string, any>): R;
    toHaveStyle(css: string | Record<string, any>): R;
    toHaveTextContent(text: string | RegExp): R;
    toHaveValue(value?: string | string[] | number | null): R;
    toBeChecked(): R;
    toBePartiallyChecked(): R;
    toHaveDescription(text: string | RegExp): R;
    toHaveDisplayValue(value: string | RegExp | Array<string | RegExp>): R;
    toHaveErrorMessage(text: string | RegExp): R;
  }
}
