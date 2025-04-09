import React from 'react';
import { announceToScreenReader, trapFocus, setupFocusManagement } from '../../utils/accessibility';

interface FormProps {
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
  error?: string;
}

export function withAccessibleForm<P extends FormProps>(WrappedComponent: React.ComponentType<P>) {
  return function AccessibleForm(props: P) {
    const formRef = React.useRef<HTMLFormElement>(null);
    const { isSubmitting, error } = props;

    React.useEffect(() => {
      if (formRef.current) {
        const removeTrapFocus = trapFocus(formRef.current);
        const focusManager = setupFocusManagement(formRef.current);
        
        focusManager.focusFirst();
        
        return () => {
          removeTrapFocus();
          focusManager.restoreFocus();
        };
      }
    }, []);

    React.useEffect(() => {
      if (isSubmitting) {
        announceToScreenReader('Form is being submitted');
      }
    }, [isSubmitting]);

    React.useEffect(() => {
      if (error) {
        announceToScreenReader(`Form submission failed: ${error}`);
      }
    }, [error]);

    const handleSubmit = (data: any) => {
      if (!isSubmitting) {
        props.onSubmit(data);
      }
    };

    return (
      <div ref={formRef} role="form" aria-busy={isSubmitting}>
        {error && (
          <div role="alert" aria-live="assertive" className="error-message">
            {error}
          </div>
        )}
        <WrappedComponent {...props} onSubmit={handleSubmit} />
      </div>
    );
  };
}
