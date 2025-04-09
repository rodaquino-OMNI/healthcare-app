import React from 'react';

interface SkipLinkProps {
  targetId: string;
  text?: string;
  className?: string;
}

export const SkipLink: React.FC<SkipLinkProps> = ({
  targetId,
  text = 'Skip to main content',
  className = 'skip-link',
}) => {
  return (
    <a 
      href={`#${targetId}`} 
      className={className}
      data-testid="skip-link"
    >
      {text}
    </a>
  );
};