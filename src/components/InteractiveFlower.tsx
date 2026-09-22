import React, { useState } from 'react';
import { FlowerData } from '../types';
import { flowerAudio } from '../audio/flowerSynthesizer';
import { Sparkles } from 'lucide-react';

interface InteractiveFlowerProps {
  flower: FlowerData;
  forceBloomed?: boolean;
  onBloomToggle?: (isBloomed: boolean) => void;
}

export const InteractiveFlower: React.FC<InteractiveFlowerProps> = ({
  flower,
  forceBloomed = false,
  onBloomToggle,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPinnedBloom, setIsPinnedBloom] = useState(false);

  const isBloomed = forceBloomed || isHovered || isPinnedBloom;

  const handleMouseEnter = () => {
    setIsHovered(true);
    flowerAudio.playBloomChime();
    onBloomToggle?.(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!isPinnedBloom) {
      onBloomToggle?.(false);
    }
  };

  const handleClick = () => {
    setIsPinnedBloom((prev) => !prev);
    flowerAudio.playBloomChime(1.2);
  };

  // SVG rendering variables for botanical layers
  const outerPetalCount = flower.type === 'sunflower' ? 16 : flower.type === 'rose' ? 12 : 10;
  const innerPetalCount = flower.type === 'sunflower' ? 12 : 8;

  return (
    <div
      className="group relative flex flex-col items-center cursor-pointer select-none py-4 px-3"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      aria-label={`Flor interactiva: ${flower.name}`}
    >
      {/* Delicate floating pollen sparkles when bloomed */}
      {isBloomed && (
        <div className="absolute -top-4 inset-x-0 flex justify-center pointer-events-none z-30">
          <div className="relative w-36 h-28">
            <span className="absolute left-6 top-2 w-1.5 h-1.5 rounded-full bg-amber-200 animate-ping opacity-75" />
            <span
              className="absolute right-8 top-4 w-2 h-2 rounded-full bg-yellow-300 animate-pulse glow-gold"
              style={{ animationDelay: '0.2s' }}
            />
            <span
              className="absolute left-1/2 -top-2 w-1.5 h-1.5 rounded-full bg-amber-100 animate-bounce"
              style={{ animationDelay: '0.4s' }}
            />
            <span
              className="absolute right-4 top-12 w-1 h-1 rounded-full bg-yellow-200 animate-ping"
              style={{ animationDelay: '0.6s' }}
            />
          </div>
        </div>
      )}

      {/* Flower Crown Container */}
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Ambient golden halo on bloom */}
        <div
          className={`absolute inset-0 rounded-full transition-all duration-1000 ease-out pointer-events-none ${
            isBloomed
              ? 'bg-amber-400/25 blur-xl scale-125 opacity-100'
              : 'bg-amber-500/0 blur-md scale-90 opacity-0'
          }`}
        />

        <svg
          viewBox="-80 -80 160 160"
          className="w-full h-full overflow-visible transition-transform duration-700 ease-out group-hover:scale-105"
        >
          <defs>
            {/* Golden petal gradient */}
            <linearGradient id={`petalGrad-${flower.id}`} x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="45%" stopColor="#F59E0B" />
              <stop offset="85%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#FEF08A" />
            </linearGradient>

            {/* Inner layered petal gradient */}
            <linearGradient id={`innerPetalGrad-${flower.id}`} x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#B45309" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#FEF08A" />
            </linearGradient>

            {/* Core center disk gradient */}
            <radialGradient id={`coreGrad-${flower.id}`}>
              <stop offset="0%" stopColor="#78350F" />
              <stop offset="65%" stopColor="#451A03" />
              <stop offset="90%" stopColor="#92400E" />
              <stop offset="100%" stopColor="#F59E0B" />
            </radialGradient>

            {/* Protective sepal green gradient */}
            <linearGradient id={`sepalGrad-${flower.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#65A30D" />
              <stop offset="100%" stopColor="#365314" />
            </linearGradient>
          </defs>

          {/* BACK LAYER: Protective Green Sepals (visible when bud or partial bloom) */}
          <g
            className="transition-all duration-1000 ease-out origin-center"
            style={{
              transform: isBloomed ? 'scale(0.85) rotate(15deg)' : 'scale(1.08) rotate(0deg)',
              opacity: isBloomed ? 0.35 : 0.9,
            }}
          >
            {[0, 60, 120, 180, 240, 300].map((angle, idx) => (
              <path
                key={`sepal-${idx}`}
                d="M -6,0 C -12,-20 -8,-38 0,-50 C 8,-38 12,-20 6,0 Z"
                fill={`url(#sepalGrad-${flower.id})`}
                transform={`rotate(${angle})`}
              />
            ))}
          </g>

          {/* LAYER 1: Outer Petals (unfurl widely with organic tilt) */}
          <g className="origin-center">
            {Array.from({ length: outerPetalCount }).map((_, idx) => {
              const baseAngle = (idx * 360) / outerPetalCount;
              // Fluid staggered unfurling formula:
              // Closed state: petals curled tightly towards center (scaleY small, angle compressed)
              // Bloomed state: petals expanded, stretched outward, radiating gently
              const scaleY = isBloomed ? 1.05 : 0.42;
              const scaleX = isBloomed ? 1.0 : 0.65;
              const rotation = baseAngle;

              return (
                <path
                  key={`outer-${idx}`}
                  d="M 0,0 C -14,-22 -16,-52 0,-70 C 16,-52 14,-22 0,0 Z"
                  fill={`url(#petalGrad-${flower.id})`}
                  className="transition-all duration-1000 ease-out origin-center"
                  style={{
                    transform: `rotate(${rotation}deg) scale(${scaleX}, ${scaleY})`,
                    transitionDelay: `${idx * 18}ms`,
                    filter: isBloomed ? 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.4))' : 'none',
                  }}
                />
              );
            })}
          </g>

          {/* LAYER 2: Middle Concentric Petals */}
          <g className="origin-center">
            {Array.from({ length: innerPetalCount }).map((_, idx) => {
              const baseAngle = (idx * 360) / innerPetalCount + 15;
              const scaleY = isBloomed ? 0.88 : 0.38;
              const scaleX = isBloomed ? 0.85 : 0.55;

              return (
                <path
                  key={`mid-${idx}`}
                  d="M 0,0 C -11,-18 -13,-40 0,-54 C 13,-40 11,-18 0,0 Z"
                  fill={`url(#innerPetalGrad-${flower.id})`}
                  className="transition-all duration-1000 ease-out origin-center"
                  style={{
                    transform: `rotate(${baseAngle}deg) scale(${scaleX}, ${scaleY})`,
                    transitionDelay: `${120 + idx * 22}ms`,
                  }}
                />
              );
            })}
          </g>

          {/* LAYER 3: Intricate Sunflower Center / Floral Corona */}
          <g
            className="transition-all duration-800 ease-out origin-center"
            style={{
              transform: isBloomed ? 'scale(1.1)' : 'scale(0.9)',
            }}
          >
            {/* Core Disk Floret */}
            <circle
              cx="0"
              cy="0"
              r={flower.type === 'sunflower' ? 24 : 17}
              fill={`url(#coreGrad-${flower.id})`}
              className="transition-transform duration-700"
            />

            {/* Glowing Golden Stamen Ring */}
            <circle
              cx="0"
              cy="0"
              r={flower.type === 'sunflower' ? 21 : 14}
              fill="none"
              stroke="#FDE047"
              strokeWidth="2"
              strokeDasharray="2,3"
              className={`transition-all duration-1000 ${isBloomed ? 'opacity-90' : 'opacity-40'}`}
            />

            {/* Inner Spiral Seeds */}
            {Array.from({ length: 12 }).map((_, sIdx) => {
              const sAngle = (sIdx * 30 * Math.PI) / 180;
              const r = flower.type === 'sunflower' ? 10 : 7;
              return (
                <circle
                  key={`seed-${sIdx}`}
                  cx={Math.cos(sAngle) * r}
                  cy={Math.sin(sAngle) * r}
                  r="1.8"
                  fill="#F59E0B"
                  opacity={isBloomed ? 0.9 : 0.5}
                />
              );
            })}
          </g>
        </svg>

        {/* Small magic status badge on hover */}
        <div
          className={`absolute -bottom-2 px-2 py-0.5 rounded-full text-[10px] font-sans font-medium tracking-wide uppercase transition-all duration-500 flex items-center gap-1 ${
            isBloomed
              ? 'bg-amber-400 text-amber-950 shadow-md shadow-amber-500/30 opacity-100 translate-y-0 scale-100'
              : 'bg-amber-950/70 text-amber-300/80 border border-amber-500/20 opacity-0 translate-y-2 scale-90'
          }`}
        >
          <Sparkles className="w-2.5 h-2.5" />
          <span>{isPinnedBloom ? 'Florecida ✨' : 'En flor'}</span>
        </div>
      </div>

      {/* Flower Botanical Stem with swaying leaves */}
      <div className="relative w-12 h-24 flex justify-center -mt-2">
        {/* Curving green stem */}
        <svg viewBox="0 0 40 100" className="w-10 h-full overflow-visible">
          <path
            d={
              isBloomed
                ? 'M 20,0 Q 22,50 20,100'
                : 'M 20,0 Q 15,45 20,100'
            }
            fill="none"
            stroke="#4D7C0F"
            strokeWidth="4"
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />

          {/* Left Leaf (unfurls when flower blooms) */}
          <path
            d="M 20,38 C 5,30 -5,45 8,56 C 16,50 19,42 20,38 Z"
            fill="#3F6212"
            className="transition-all duration-1000 origin-[20px_38px]"
            style={{
              transform: isBloomed ? 'scale(1.15) rotate(5deg)' : 'scale(0.7) rotate(-15deg)',
              opacity: isBloomed ? 0.95 : 0.65,
            }}
          />

          {/* Right Leaf */}
          <path
            d="M 20,58 C 35,50 45,65 32,76 C 24,70 21,62 20,58 Z"
            fill="#4D7C0F"
            className="transition-all duration-1000 origin-[20px_58px]"
            style={{
              transform: isBloomed ? 'scale(1.15) rotate(-5deg)' : 'scale(0.7) rotate(15deg)',
              opacity: isBloomed ? 0.95 : 0.65,
            }}
          />
        </svg>
      </div>

      {/* Flower Title & Romantic Meaning Card */}
      <div className="mt-1 text-center max-w-[160px]">
        <h4 className="font-serif text-sm font-semibold text-amber-100 tracking-wide group-hover:text-amber-300 transition-colors">
          {flower.name}
        </h4>
        <p className="text-[11px] text-amber-300/80 font-sans italic line-clamp-1 mt-0.5">
          {flower.meaning}
        </p>
        <span className="text-[9px] text-amber-400/60 uppercase tracking-widest block mt-0.5">
          {isBloomed ? 'Toca para cerrar' : 'Pasa el cursor'}
        </span>
      </div>
    </div>
  );
};
