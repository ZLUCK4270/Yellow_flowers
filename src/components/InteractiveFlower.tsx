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

  // Botanical parameters
  const isSunflower = flower.type === 'sunflower';
  const isDaisy = flower.type === 'daisy';
  const isRose = flower.type === 'rose';
  const isTulip = flower.type === 'tulip';

  const sunflowerOuterCount = 16;
  const sunflowerInnerCount = 12;
  const daisyPetalCount = 18;

  return (
    <div
      className="group relative flex flex-col items-center cursor-pointer select-none py-3 px-2 w-full max-w-[190px]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      aria-label={`Flor interactiva: ${flower.name}`}
    >
      {/* Floating pollen particles when bloomed */}
      {isBloomed && (
        <div className="absolute top-2 inset-x-0 flex justify-center pointer-events-none z-30">
          <div className="relative w-36 h-28">
            <span className="absolute left-6 top-3 w-1.5 h-1.5 rounded-full bg-amber-200 animate-ping opacity-75" />
            <span
              className="absolute right-7 top-4 w-2 h-2 rounded-full bg-yellow-300 animate-pulse glow-gold"
              style={{ animationDelay: '0.2s' }}
            />
            <span
              className="absolute left-1/2 -top-1 w-1.5 h-1.5 rounded-full bg-amber-100 animate-bounce"
              style={{ animationDelay: '0.4s' }}
            />
            <span
              className="absolute right-4 top-10 w-1 h-1 rounded-full bg-yellow-200 animate-ping"
              style={{ animationDelay: '0.6s' }}
            />
          </div>
        </div>
      )}

      {/* Main Unified Botanical Plant SVG */}
      <div className="relative w-40 sm:w-44 h-56 sm:h-60 flex items-center justify-center">
        {/* Soft Golden Bloom Halo */}
        <div
          className={`absolute top-4 w-32 h-32 rounded-full transition-all duration-1000 ease-out pointer-events-none ${
            isBloomed
              ? 'bg-amber-400/25 blur-xl scale-125 opacity-100'
              : 'bg-amber-500/0 blur-md scale-90 opacity-0'
          }`}
        />

        <svg
          viewBox="-80 -75 160 215"
          className="w-full h-full overflow-visible transition-transform duration-700 ease-out group-hover:scale-105"
        >
          <defs>
            {/* Primary Golden Petal Gradient */}
            <linearGradient id={`petalGrad-${flower.id}`} x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={flower.id.includes('medianoche') ? '#78350F' : '#D97706'} />
              <stop offset="35%" stopColor="#F59E0B" />
              <stop offset="80%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#FEF08A" />
            </linearGradient>

            {/* Daisy Petal Gradient */}
            <linearGradient id={`daisyGrad-${flower.id}`} x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="30%" stopColor="#FBBF24" />
              <stop offset="70%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#FFFBEB" />
            </linearGradient>

            {/* Rose Petal Gradient */}
            <linearGradient id={`roseGrad-${flower.id}`} x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#B45309" />
              <stop offset="40%" stopColor="#F59E0B" />
              <stop offset="85%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#FEF9C3" />
            </linearGradient>

            {/* Tulip Petal Gradient */}
            <linearGradient id={`tulipGrad-${flower.id}`} x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#B45309" />
              <stop offset="25%" stopColor="#EA580C" />
              <stop offset="60%" stopColor="#F59E0B" />
              <stop offset="90%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#FEF08A" />
            </linearGradient>

            {/* Sunflower Center Core Gradient */}
            <radialGradient id={`coreGrad-${flower.id}`}>
              <stop offset="0%" stopColor={flower.id.includes('medianoche') ? '#261205' : '#5B210B'} />
              <stop offset="60%" stopColor={flower.id.includes('medianoche') ? '#180B02' : '#3F1805'} />
              <stop offset="85%" stopColor="#78350F" />
              <stop offset="100%" stopColor="#D97706" />
            </radialGradient>

            {/* Daisy Sunny Center Gradient */}
            <radialGradient id={`daisyCore-${flower.id}`}>
              <stop offset="0%" stopColor="#B45309" />
              <stop offset="50%" stopColor="#D97706" />
              <stop offset="85%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#FDE047" />
            </radialGradient>

            {/* Stem Gradient */}
            <linearGradient id={`stemGrad-${flower.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2E4A0C" />
              <stop offset="50%" stopColor="#4D7C0F" />
              <stop offset="100%" stopColor="#3F6212" />
            </linearGradient>
          </defs>

          {/* 1. BOTANICAL STEM (Seamlessly connects right into the flower receptacle) */}
          <g>
            <path
              d={
                isBloomed
                  ? 'M 0,14 Q 4,68 -2,130'
                  : 'M 0,14 Q -3,68 0,130'
              }
              fill="none"
              stroke={`url(#stemGrad-${flower.id})`}
              strokeWidth={isSunflower ? 5.5 : 4.5}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />

            {/* Left Leaf */}
            <path
              d="M 1,52 C -14,44 -30,36 -34,48 C -26,62 -10,60 1,55 Z"
              fill="#365314"
              stroke="#4D7C0F"
              strokeWidth="1"
              style={{
                transformBox: 'fill-box',
                transformOrigin: '100% 50%',
                transform: isBloomed ? 'scale(1.15) rotate(6deg)' : 'scale(0.85) rotate(-6deg)',
                transition: 'transform 900ms ease-out',
              }}
            />

            {/* Right Leaf */}
            <path
              d="M -1,82 C 14,75 32,68 36,80 C 28,94 10,91 -1,85 Z"
              fill="#3F6212"
              stroke="#65A30D"
              strokeWidth="1"
              style={{
                transformBox: 'fill-box',
                transformOrigin: '0% 50%',
                transform: isBloomed ? 'scale(1.15) rotate(-6deg)' : 'scale(0.85) rotate(6deg)',
                transition: 'transform 900ms ease-out',
              }}
            />

            {/* Receptacle Cup (Calyx base anchoring the flower head to the stem) */}
            <path
              d="M -14,6 C -12,20 12,20 14,6 C 8,24 -8,24 -14,6 Z"
              fill="#2E4A0C"
              stroke="#365314"
              strokeWidth="1"
            />
          </g>

          {/* 2. PROTECTIVE GREEN SEPALS */}
          <g
            className="transition-all duration-1000 ease-out"
            style={{
              transformOrigin: '0px 0px',
              transformBox: 'view-box',
              transform: isBloomed ? 'scale(0.88) rotate(15deg)' : 'scale(1.05) rotate(0deg)',
              opacity: isBloomed ? 0.35 : 0.85,
            }}
          >
            {[0, 60, 120, 180, 240, 300].map((angle, idx) => (
              <path
                key={`sep-${idx}`}
                d="M -6,0 C -12,-18 -8,-36 0,-48 C 8,-36 12,-18 6,0 Z"
                fill="#365314"
                transform={`rotate(${angle})`}
              />
            ))}
          </g>

          {/* 3. BOTANICAL PETALS (Species-specific & anchored perfectly at 0,0) */}

          {/* === A. SUNFLOWER (Girasol Imperial / Medianoche) === */}
          {isSunflower && (
            <>
              {/* Outer Ray Petals */}
              <g>
                {Array.from({ length: sunflowerOuterCount }).map((_, idx) => {
                  const angle = (idx * 360) / sunflowerOuterCount;
                  const scaleY = isBloomed ? 1.05 : 0.44;
                  const scaleX = isBloomed ? 1.0 : 0.62;

                  return (
                    <g key={`sun-outer-${idx}`} transform={`rotate(${angle})`}>
                      <path
                        d="M 0,0 C -13,-20 -15,-48 0,-68 C 15,-48 13,-20 0,0 Z"
                        fill={`url(#petalGrad-${flower.id})`}
                        style={{
                          transformBox: 'fill-box',
                          transformOrigin: '50% 100%',
                          transform: `scale(${scaleX}, ${scaleY})`,
                          transition: `transform 850ms cubic-bezier(0.16, 1, 0.3, 1) ${idx * 16}ms, filter 500ms ease`,
                          filter: isBloomed ? 'drop-shadow(0 0 5px rgba(245, 158, 11, 0.45))' : 'none',
                        }}
                      />
                    </g>
                  );
                })}
              </g>

              {/* Inner Staggered Petals */}
              <g>
                {Array.from({ length: sunflowerInnerCount }).map((_, idx) => {
                  const angle = (idx * 360) / sunflowerInnerCount + 15;
                  const scaleY = isBloomed ? 0.88 : 0.38;
                  const scaleX = isBloomed ? 0.88 : 0.55;

                  return (
                    <g key={`sun-inner-${idx}`} transform={`rotate(${angle})`}>
                      <path
                        d="M 0,0 C -10,-16 -12,-38 0,-52 C 12,-38 10,-16 0,0 Z"
                        fill={`url(#petalGrad-${flower.id})`}
                        style={{
                          transformBox: 'fill-box',
                          transformOrigin: '50% 100%',
                          transform: `scale(${scaleX}, ${scaleY})`,
                          transition: `transform 850ms cubic-bezier(0.16, 1, 0.3, 1) ${100 + idx * 16}ms`,
                        }}
                      />
                    </g>
                  );
                })}
              </g>
            </>
          )}

          {/* === B. DAISY (Margarita Silvestre) === */}
          {isDaisy && (
            <g>
              {Array.from({ length: daisyPetalCount }).map((_, idx) => {
                const angle = (idx * 360) / daisyPetalCount;
                const scaleY = isBloomed ? 1.05 : 0.42;
                const scaleX = isBloomed ? 1.0 : 0.6;

                return (
                  <g key={`daisy-${idx}`} transform={`rotate(${angle})`}>
                    <path
                      d="M 0,0 C -6,-18 -7,-44 0,-62 C 7,-44 6,-18 0,0 Z"
                      fill={`url(#daisyGrad-${flower.id})`}
                      style={{
                        transformBox: 'fill-box',
                        transformOrigin: '50% 100%',
                        transform: `scale(${scaleX}, ${scaleY})`,
                        transition: `transform 800ms cubic-bezier(0.16, 1, 0.3, 1) ${idx * 15}ms, filter 500ms ease`,
                        filter: isBloomed ? 'drop-shadow(0 0 4px rgba(253, 224, 71, 0.5))' : 'none',
                      }}
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* === C. ROSE (Rosa Dorada) === */}
          {isRose && (
            <g>
              {/* Outer Whorl: 6 broad cupped petals */}
              {[0, 60, 120, 180, 240, 300].map((angle, idx) => {
                const scaleY = isBloomed ? 1.05 : 0.45;
                const scaleX = isBloomed ? 1.05 : 0.65;
                return (
                  <g key={`rose-out-${idx}`} transform={`rotate(${angle})`}>
                    <path
                      d="M 0,0 C -18,-14 -22,-36 -8,-50 C 0,-55 8,-55 16,-46 C 22,-36 18,-14 0,0 Z"
                      fill={`url(#roseGrad-${flower.id})`}
                      style={{
                        transformBox: 'fill-box',
                        transformOrigin: '50% 100%',
                        transform: `scale(${scaleX}, ${scaleY})`,
                        transition: `transform 850ms cubic-bezier(0.16, 1, 0.3, 1) ${idx * 20}ms`,
                      }}
                    />
                  </g>
                );
              })}

              {/* Mid Whorl: 6 overlapping petals */}
              {[30, 90, 150, 210, 270, 330].map((angle, idx) => {
                const scaleY = isBloomed ? 0.9 : 0.4;
                const scaleX = isBloomed ? 0.9 : 0.58;
                return (
                  <g key={`rose-mid-${idx}`} transform={`rotate(${angle})`}>
                    <path
                      d="M 0,0 C -14,-10 -18,-28 -6,-38 C 0,-42 6,-42 12,-34 C 16,-26 14,-10 0,0 Z"
                      fill={`url(#roseGrad-${flower.id})`}
                      style={{
                        transformBox: 'fill-box',
                        transformOrigin: '50% 100%',
                        transform: `scale(${scaleX}, ${scaleY})`,
                        transition: `transform 850ms cubic-bezier(0.16, 1, 0.3, 1) ${100 + idx * 20}ms`,
                      }}
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* === D. TULIP (Tulipán del Sol) === */}
          {isTulip && (
            <g>
              {/* Back Petals (spread wider when bloomed) */}
              {[-38, 38].map((angle, idx) => {
                const scaleY = isBloomed ? 1.05 : 0.55;
                const tiltAngle = isBloomed ? angle * 1.25 : angle * 0.45;
                return (
                  <g key={`tulip-back-${idx}`} transform={`rotate(${tiltAngle})`}>
                    <path
                      d="M 0,0 C -16,-24 -18,-54 0,-68 C 18,-54 16,-24 0,0 Z"
                      fill={`url(#tulipGrad-${flower.id})`}
                      style={{
                        transformBox: 'fill-box',
                        transformOrigin: '50% 100%',
                        transform: `scale(${isBloomed ? 1 : 0.8}, ${scaleY})`,
                        transition: 'transform 850ms cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    />
                  </g>
                );
              })}

              {/* Side Tepals */}
              {[-18, 18].map((angle, idx) => {
                const tiltAngle = isBloomed ? angle * 1.3 : angle * 0.5;
                return (
                  <g key={`tulip-side-${idx}`} transform={`rotate(${tiltAngle})`}>
                    <path
                      d="M 0,0 C -14,-22 -16,-52 0,-66 C 16,-52 14,-22 0,0 Z"
                      fill={`url(#tulipGrad-${flower.id})`}
                      style={{
                        transformBox: 'fill-box',
                        transformOrigin: '50% 100%',
                        transform: `scale(${isBloomed ? 1.02 : 0.75}, ${isBloomed ? 1.02 : 0.58})`,
                        transition: 'transform 850ms cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    />
                  </g>
                );
              })}

              {/* Front Center Petal */}
              <g>
                <path
                  d="M 0,0 C -12,-20 -14,-50 0,-64 C 14,-50 12,-20 0,0 Z"
                  fill={`url(#tulipGrad-${flower.id})`}
                  style={{
                    transformBox: 'fill-box',
                    transformOrigin: '50% 100%',
                    transform: `scale(${isBloomed ? 1 : 0.8}, ${isBloomed ? 1 : 0.65})`,
                    transition: 'transform 850ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              </g>
            </g>
          )}

          {/* 4. FLOWER CORE / FLORET (Species Specific & centered at 0,0) */}
          <g
            className="transition-all duration-800 ease-out"
            style={{
              transformOrigin: '0px 0px',
              transformBox: 'view-box',
              transform: isBloomed ? 'scale(1.08)' : 'scale(0.96)',
            }}
          >
            {/* Sunflower Center */}
            {isSunflower && (
              <>
                <circle cx="0" cy="0" r="21" fill={`url(#coreGrad-${flower.id})`} />
                <circle
                  cx="0"
                  cy="0"
                  r="18"
                  fill="none"
                  stroke="#FDE047"
                  strokeWidth="2"
                  strokeDasharray="2,3"
                  className={`transition-opacity duration-1000 ${isBloomed ? 'opacity-90' : 'opacity-40'}`}
                />
                {Array.from({ length: 12 }).map((_, sIdx) => {
                  const sAngle = (sIdx * 30 * Math.PI) / 180;
                  return (
                    <circle
                      key={`seed-${sIdx}`}
                      cx={Math.cos(sAngle) * 9}
                      cy={Math.sin(sAngle) * 9}
                      r="1.6"
                      fill="#F59E0B"
                      opacity={isBloomed ? 0.95 : 0.5}
                    />
                  );
                })}
              </>
            )}

            {/* Daisy Button Center */}
            {isDaisy && (
              <>
                <circle cx="0" cy="0" r="15" fill={`url(#daisyCore-${flower.id})`} />
                <circle
                  cx="0"
                  cy="0"
                  r="12"
                  fill="none"
                  stroke="#FEF08A"
                  strokeWidth="1.5"
                  strokeDasharray="1.5,2.5"
                  opacity={isBloomed ? 0.95 : 0.5}
                />
              </>
            )}

            {/* Rose Spiral Bud Center */}
            {isRose && (
              <g>
                <circle cx="0" cy="0" r="14" fill="#92400E" />
                <path
                  d="M -6,-2 C -3,-8 4,-8 7,-3 C 9,3 3,7 -2,6 C -6,5 -7,0 -4,-2"
                  fill="none"
                  stroke="#FDE047"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* Tulip Pistil Center */}
            {isTulip && (
              <g>
                <circle cx="0" cy="0" r="7" fill="#451A03" />
                <circle cx="0" cy="0" r="3" fill="#FDE047" />
              </g>
            )}
          </g>
        </svg>

        {/* Small floating badge */}
        <div
          className={`absolute bottom-1 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium tracking-wide uppercase transition-all duration-500 flex items-center gap-1 ${
            isBloomed
              ? 'bg-amber-400 text-amber-950 shadow-md shadow-amber-500/30 opacity-100 translate-y-0 scale-100'
              : 'bg-amber-950/70 text-amber-300/80 border border-amber-500/20 opacity-0 translate-y-2 scale-90 pointer-events-none'
          }`}
        >
          <Sparkles className="w-2.5 h-2.5" />
          <span>{isPinnedBloom ? 'Florecida ✨' : 'En flor'}</span>
        </div>
      </div>

      {/* Flower Title & Meaning Card */}
      <div className="mt-1 text-center max-w-[170px]">
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
