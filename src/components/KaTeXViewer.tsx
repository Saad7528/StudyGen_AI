'use client';

import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface KaTeXViewerProps {
  content: string;
  className?: string;
  block?: boolean;
}

export const KaTeXViewer: React.FC<KaTeXViewerProps> = ({ content, className = '', block = false }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current || !content) return;

    // Check if the text contains LaTeX expressions delimited by $...$ or $$...$$
    const hasMath = content.includes('$');

    if (!hasMath) {
      containerRef.current.textContent = content;
      return;
    }

    try {
      // Split content by LaTeX delimiters ($...$)
      const parts = content.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/g);
      containerRef.current.innerHTML = '';

      parts.forEach((part) => {
        if (!part) return;

        if (part.startsWith('$$') && part.endsWith('$$')) {
          const math = part.slice(2, -2).trim();
          const span = document.createElement('span');
          katex.render(math, span, { displayMode: true, throwOnError: false });
          containerRef.current?.appendChild(span);
        } else if (part.startsWith('$') && part.endsWith('$')) {
          const math = part.slice(1, -1).trim();
          const span = document.createElement('span');
          katex.render(math, span, { displayMode: false, throwOnError: false });
          containerRef.current?.appendChild(span);
        } else {
          const textNode = document.createTextNode(part);
          containerRef.current?.appendChild(textNode);
        }
      });
    } catch {
      if (containerRef.current) {
        containerRef.current.textContent = content;
      }
    }
  }, [content, block]);

  return <span ref={containerRef} className={`inline-block ${className}`} />;
};
