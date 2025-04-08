# Comprehensive TypeScript Error Fix Guide

This guide provides detailed instructions for fixing all TypeScript errors in the LTHT React application. It expands on the existing error categories and provides step-by-step solutions.

## Error Categories and Solutions

### 1. Missing Module Declarations (ts(2307))

These errors occur when TypeScript cannot find type definitions for imported modules.

#### Examples from Error Log:
```
Cannot find module 'react-router-dom' or its corresponding type declarations. ts(2307)
Cannot find module '@ltht-react/card' or its corresponding type declarations. ts(2307)
Cannot find module './components/layout/MainLayout' or its corresponding type declarations. ts(2307)
```

#### Solution Steps:

1. **Create Module Declaration Files**:
   - Create or update `src/types/ltht-module-declarations.d.ts` for LTHT components
   - Create or update `src/types/external-modules.d.ts` for third-party libraries
   - Create or update `src/types/missing-module-declarations.d.ts` for any remaining modules

2. **Declare LTHT Component Modules**:
   ```typescript
   // In ltht-module-declarations.d.ts
   declare module '@ltht-react/card' {
     import { FC, HTMLAttributes } from 'react';
     
     export interface CardProps extends HTMLAttributes<HTMLDivElement> {}
     export interface CardBodyProps {
       children?: React.ReactNode;
     }
     
     interface CardComposition {
       Body: FC<CardBodyProps>;
     }
     
     export const Card: FC<CardProps> & CardComposition;
     export default Card;
   }
   ```

3. **Declare External Libraries**:
   ```typescript
   // In external-modules.d.ts
   declare module 'react-router-dom' {
     import React from 'react';
     
     export interface RouteProps {
       path?: string;
       element?: React.ReactNode;
       // other props
     }
     
     export const Route: React.FC<RouteProps>;
     export const BrowserRouter: React.FC<{ children?: React.ReactNode }>;
     // other exports
   }
   ```

4. **Declare Internal Modules**:
   ```typescript
   // In missing-module-declarations.d.ts
   declare module './components/layout/MainLayout' {
     const MainLayout: React.FC<{ children: React.ReactNode }>;
     export default MainLayout;
   }
   ```

5. **Update tsconfig.json**:
   ```json
   {
     "compilerOptions": {
       "typeRoots": [
         "./node_modules/@types",
         "./src/types"
       ],
       // other options
     }
   }
   ```

### 2. Property Errors (ts(2339))

These errors occur when TypeScript cannot find properties on objects because they're either missing from type definitions or the types are incorrect.

#### Examples from Error Log:
```
Property 'colors' does not exist on type 'Theme'. ts(2339)
Property 'Item' does not exist on type 'FC<ListProps>'. ts(2339)
```

#### Solution Steps:

1. **Complete Theme Interface**:
   ```typescript
   // In external-modules.d.ts or ltht-module-declarations.d.ts
   declare module '@ltht-react/styles' {
     export interface Theme {
       colors: {
         background: {
           base: string;
           secondary: string;
           [key: string]: string;
         };
         text: {
           primary: string;
           secondary: string;
           [key: string]: string;
         };
         [key: string]: any;
       };
       // other theme properties
     }
   }
   ```

2. **Fix Component Composition Types**:
   ```typescript
   // For components with subcomponents like List.Item
   interface ListComposition {
     Item: React.FC<ListItemProps>;
   }
   export const List: React.FC<ListProps> & ListComposition;
   ```

3. **Implement Component Wrappers**:
   ```typescript
   // In ltht-component-wrappers.tsx
   export const List = Object.assign(
     (props: ListProps) => {
       return React.createElement(ListOriginal as any, props);
     },
     {
       Item: (props: ListItemProps) => {
         return React.createElement((ListOriginal as any).Item, props);
       }
     }
   );
   ```

4. **Use Indexed Access Types for Dynamic Properties**:
   ```typescript
   // For objects with dynamic properties
   interface DynamicObject {
     [key: string]: any;
   }
   ```

### 3. Type Incompatibility (ts(2322))

These errors occur when props passed to components don't match the expected types defined in the component interfaces.

#### Examples from Error Log:
```
Type '{ variant: "success"; }' is not assignable to type 'ButtonProps'. ts(2322)
```

#### Solution Steps:

1. **Expand Union Types**:
   ```typescript
   // In ltht-module-declarations.d.ts
   export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
     variant?: 'primary' | 'secondary' | 'tertiary' | 'link' | 'success' | 'danger';
     // other props
   }
   ```

2. **Use Specific Event Types**:
   ```typescript
   // Instead of generic event types
   submitHandler: (event: React.FormEvent) => void;
   
   // Use specific event types
   submitHandler: (event: React.FormEvent<HTMLFormElement>) => void;
   ```

3. **Create Type-Safe Wrappers**:
   ```typescript
   // In ltht-component-wrappers.tsx
   export const Button: React.FC<ButtonProps> = (props) => {
     // Use type assertion only when necessary
     return React.createElement(ButtonOriginal as any, props);
   };
   ```

4. **Optional vs. Required Props**:
   ```typescript
   // Make props optional when appropriate
   interface ComponentProps {
     required: string;
     optional?: string;
   }
   ```

### 4. JSX Compilation Errors

These errors occur due to TypeScript configuration issues related to JSX handling.

#### Examples from Error Log:
```
Cannot use JSX unless the '--jsx' flag is provided. ts(17004)
```

#### Solution Steps:

1. **Update tsconfig.json**:
   ```json
   {
     "compilerOptions": {
       "jsx": "react-jsx",
       // other options
     }
   }
   ```

2. **Consistent React Imports**:
   ```typescript
   // With esModuleInterop: true
   import React from 'react';
   
   // Without esModuleInterop
   import * as React from 'react';
   ```

3. **JSX Pragma Comments**:
   ```typescript
   /** @jsx jsx */
   import { jsx } from '@emotion/react';
   ```

### 5. React Import Issues

These errors occur due to inconsistent React import patterns and TypeScript configuration issues.

#### Examples from Error Log:
```
Module can only be default-imported using the 'esModuleInterop' flag. ts(1259)
```

#### Solution Steps:

1. **Enable esModuleInterop**:
   ```json
   {
     "compilerOptions": {
       "esModuleInterop": true,
       // other options
     }
   }
   ```

2. **Standardize Import Pattern**:
   ```typescript
   // Choose one pattern and use it consistently
   import React from 'react';
   ```

3. **Update All React Imports**:
   - Search for all React imports in the codebase
   - Update them to use the standardized pattern

## Implementation Strategy

To fix all TypeScript errors systematically:

1. **Fix TypeScript Configuration**:
   - Update `tsconfig.json` with proper settings:
     - Enable `"jsx": "react-jsx"`
     - Enable `"esModuleInterop": true`
     - Set `"moduleResolution": "node"`
     - Configure `"typeRoots"` to include custom type directories

2. **Create/Update Type Declaration Files**:
   - Update `ltht-module-declarations.d.ts` with all LTHT component types
   - Update `external-modules.d.ts` with third-party library types
   - Create `missing-module-declarations.d.ts` for any remaining modules

3. **Fix Component Wrappers**:
   - Ensure all component wrappers in `ltht-component-wrappers.tsx` use proper typing
   - Implement composition patterns for components with subcomponents
   - Use type assertions only when necessary

4. **Standardize Import Patterns**:
   - Use consistent React import syntax across all files
   - Update all component imports to use the centralized wrappers

5. **Fix Specific Error Categories**:
   - Address property errors by completing interface definitions
   - Fix type incompatibilities by expanding union types
   - Resolve event handler typing issues with specific event types

## Testing Your Fixes

After implementing the fixes, test them thoroughly:

1. **TypeScript Compilation**:
   ```bash
   npx tsc --noEmit
   ```

2. **Development Server**:
   ```bash
   npm start
   ```

3. **Component Testing**:
   - Test each component that had TypeScript errors
   - Verify that all functionality works as expected

## Common Pitfalls to Avoid

1. **Overusing `any` Type**:
   - Avoid using `any` as a quick fix
   - Create proper interfaces instead

2. **Inconsistent Import Patterns**:
   - Stick to one import pattern throughout the codebase
   - Don't mix default and namespace imports

3. **Duplicate Type Declarations**:
   - Check for duplicate interface or type declarations
   - Use module augmentation instead of redefinition

4. **Missing Subcomponent Types**:
   - Remember to type component compositions (Card.Body, List.Item, etc.)
   - Use intersection types for complex compositions

5. **Incorrect Event Types**:
   - Use specific event types for event handlers
   - Avoid generic event types that lose type information

## Advanced TypeScript Techniques

For more complex scenarios, consider these advanced techniques:

1. **Conditional Types**:
   ```typescript
   type ButtonVariant<T> = T extends 'primary' | 'secondary' ? T : never;
   ```

2. **Generic Components**:
   ```typescript
   function Select<T>(props: SelectProps<T>): JSX.Element {
     // implementation
   }
   ```

3. **Type Guards**:
   ```typescript
   function isPatient(obj: any): obj is Patient {
     return obj && typeof obj.id === 'string';
   }
   ```

4. **Mapped Types**:
   ```typescript
   type ReadOnly<T> = {
     readonly [P in keyof T]: T[P];
   };
   ```

5. **Module Augmentation**:
   ```typescript
   declare module '@ltht-react/styles' {
     interface Theme {
       // Add new properties
       newProperty: string;
     }
   }
   ```

By following this comprehensive guide, you should be able to fix all TypeScript errors in the LTHT React application and establish best practices for future development.
