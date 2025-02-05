import React, { useState } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';

interface CopyButtonProps {
  text: string;
  label?: string;
  size?: 'normal' | 'large';
  className?: string;
}

export default function CopyButton({ text, label = 'Copy', size = 'normal', className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={className}
      title={label}
    >
      {copied ? (
        <FaCheck className="text-base" />
      ) : (
        <FaCopy className="text-base" />
      )}
      <span className="sr-only">{label}</span>
    </button>
  );
}