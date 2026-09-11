'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { AnimationItem } from 'lottie-web';

interface LottiePlayerProps {
  animationData?: any;
  src?: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

export const LottiePlayer: React.FC<LottiePlayerProps> = ({
  animationData,
  src,
  className = '',
  loop = true,
  autoplay = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const loadLottie = async () => {
      try {
        const lottieModule = await import('lottie-web');
        const lottie = lottieModule.default || lottieModule;

        if (isCancelled || !containerRef.current) return;

        // Destroy any existing instance
        if (animRef.current) {
          animRef.current.destroy();
          animRef.current = null;
        }

        const anim = lottie.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop,
          autoplay,
          ...(animationData ? { animationData } : src ? { path: src } : {}),
        });

        anim.addEventListener('DOMLoaded', () => {
          if (!isCancelled) setIsLoaded(true);
        });

        animRef.current = anim;
      } catch (error) {
        console.error('Failed to load Lottie animation:', error);
      }
    };

    loadLottie();

    return () => {
      isCancelled = true;
      if (animRef.current) {
        animRef.current.destroy();
        animRef.current = null;
      }
    };
  }, [src, animationData, loop, autoplay]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500/30 border-t-indigo-600 animate-spin" />
        </div>
      )}
      <div
        ref={containerRef}
        className={`w-full h-full transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
