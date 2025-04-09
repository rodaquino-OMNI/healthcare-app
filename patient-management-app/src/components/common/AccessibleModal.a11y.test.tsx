import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { AccessibleModal } from './AccessibleModal';

expect.extend(toHaveNoViolations);

describe('AccessibleModal', () => {
  // Mock portal container for testing
  beforeEach(() => {
    // Create portal root for modal
    const portalRoot = document.createElement('div');
    portalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(portalRoot);
  });

  afterEach(() => {
    // Clean up portal root
    const portalRoot = document.getElementById('modal-root');
    if (portalRoot) {
      document.body.removeChild(portalRoot);
    }
    // Clean up any modal elements that might be left in the body
    document.querySelectorAll('.modal-overlay').forEach(el => {
      if (el.parentElement) {
        el.parentElement.removeChild(el);
      }
    });
  });

  it('should not have accessibility violations when open', async () => {
    const { container } = render(
      <AccessibleModal 
        isOpen={true}
        onClose={() => {}}
        title="Accessible Test Modal"
        ariaDescription="This is a test modal for accessibility testing"
      >
        <p>Modal content for testing</p>
        <button>Test Button</button>
      </AccessibleModal>
    );

    // Wait for modal to be fully rendered
    await screen.findByRole('dialog');
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not render when closed', () => {
    render(
      <AccessibleModal 
        isOpen={false}
        onClose={() => {}}
        title="Closed Modal"
      >
        <p>You should not see this content</p>
      </AccessibleModal>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should call onClose when escape key is pressed', async () => {
    const handleClose = jest.fn();
    
    render(
      <AccessibleModal 
        isOpen={true}
        onClose={handleClose}
        title="Press ESC Modal"
      >
        <p>Press ESC to close me</p>
      </AccessibleModal>
    );

    // Wait for modal to be rendered
    await screen.findByRole('dialog');
    
    // Simulate ESC key press
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when clicking the close button', async () => {
    const handleClose = jest.fn();
    
    render(
      <AccessibleModal 
        isOpen={true}
        onClose={handleClose}
        title="Close Button Modal"
      >
        <p>Click the X to close me</p>
      </AccessibleModal>
    );

    // Wait for modal to be rendered
    await screen.findByRole('dialog');
    
    // Find and click the close button
    const closeButton = screen.getByLabelText(/close/i);
    fireEvent.click(closeButton);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when clicking overlay', async () => {
    const handleClose = jest.fn();
    
    render(
      <AccessibleModal 
        isOpen={true}
        onClose={handleClose}
        title="Overlay Click Modal"
      >
        <p>Click outside to close me</p>
      </AccessibleModal>
    );

    // Wait for modal to be rendered
    await screen.findByRole('dialog');
    
    // Find and click the overlay (modal backdrop)
    const overlay = document.querySelector('.modal-overlay') as HTMLElement;
    fireEvent.click(overlay);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});