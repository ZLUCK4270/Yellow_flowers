import React, { useState } from 'react';
import { Sparkles, Sun, Droplets, Heart } from 'lucide-react';
import { flowerAudio } from '../audio/flowerSynthesizer';

const ROMANTIC_QUOTES = [
  '“Y ella sabía que él sabía, que algún día pasaría... que vendría a buscarla con sus flores amarillas.”',
  '“El 21 de septiembre florece todo lo bonito que llevo guardado para ti.”',
  '“Las flores amarillas significan que quiero verte sonreír todos los días de mi vida.”',
  '“Un girasol nunca olvida mirar al sol, y yo nunca olvido agradecer tu presencia.”',
  '“Que nunca te falte luz, alegría ni flores en tu camino.”',
];

export const CenterpieceSunflower: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLockedBloom, setIsLockedBloom] = useState(false);
  const [sunlightActive, setSunlightActive] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const isBloomed = isHovered || isLockedBloom || sunlightActive;

  const handleMouseEnter = () => {
    setIsHovered(true);
    flowerAudio.playBloomChime(1.0);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleToggleLock = () => {
    setIsLockedBloom((prev) => !prev);
    flowerAudio.playBloomChime(1.25);
  };

  const handleSunbeamBath = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSunlightActive(true);
    flowerAudio.playBloomChime(1.4);
    setTimeout(() => setSunlightActive(false), 3500);
  };

  const handleNextQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuoteIndex((prev) => (prev + 1) % ROMANTIC_QUOTES.length);
    flowerAudio.playBloomChime(0.9);
  };

  const petalCount = 20;

  return (
    <div className="relative z-10 w-full max-w-lg mx-auto my-6 px-4 flex flex-col items-center select-none">
      {/* Interactive Main Stage Container */}
      <div
        className="relative group cursor-pointer flex flex-col items-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleToggleLock}
      >
        {/* Luminous Sunbeam Halo */}
        <div
          className={`absolute -inset-10 rounded-full transition-all duration-1000 ease-out pointer-events-none ${
            isBloomed
              ? 'bg-amber-400/30 blur-2xl scale-110 opacity-100'
              : 'bg-amber-500/0 blur-md scale-75 opacity-0'
          }`}
        />

        {/* Sunlight Shower Effect when active */}
        {sunlightActive && (
          <div className="absolute -top-16 inset-x-0 flex justify-center pointer-events-none z-30 animate-pulse">
            <div className="w-56 h-72 bg-gradient-to-b from-yellow-200/50 via-amber-300/30 to-transparent blur-md transform rotate-12 rounded-full" />
          </div>
        )}

        {/* Floating Sparks on Bloom */}
        {isBloomed && (
          <div className="absolute -top-6 inset-x-0 h-40 pointer-events-none z-30">
            <div className="relative w-full h-full">
              <span className="absolute left-[15%] top-[10%] w-2 h-2 rounded-full bg-yellow-200 animate-ping" />
              <span
                className="absolute right-[20%] top-[25%] w-2.5 h-2.5 rounded-full bg-amber-300 animate-pulse glow-gold"
                style={{ animationDelay: '0.3s' }}
              />
              <span
                className="absolute left-[48%] top-[5%] w-1.5 h-1.5 rounded-full bg-white animate-bounce"
                style={{ animationDelay: '0.5s' }}
              />
              <span
                className="absolute right-[12%] top-[40%] w-2 h-2 rounded-full bg-amber-400 animate-ping"
                style={{ animationDelay: '0.8s' }}
              />
            </div>
          </div>
        )}

        {/* The Giant Sunflower Head SVG */}
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
          <svg
            viewBox="-110 -110 220 220"
            className="w-full h-full overflow-visible transition-transform duration-700 ease-out group-hover:scale-105"
          >
            <defs>
              <linearGradient id="centerpiecePetalGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#B45309" />
                <stop offset="35%" stopColor="#F59E0B" />
                <stop offset="75%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#FEF08A" />
              </linearGradient>

              <linearGradient id="centerpieceMidPetal" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#92400E" />
                <stop offset="45%" stopColor="#F59E0B" />
                <stop offset="90%" stopColor="#FEF08A" />
              </linearGradient>

              <radialGradient id="sunflowerCoreGrad">
                <stop offset="0%" stopColor="#5B210B" />
                <stop offset="60%" stopColor="#351608" />
                <stop offset="85%" stopColor="#78350F" />
                <stop offset="100%" stopColor="#D97706" />
              </radialGradient>
            </defs>

            {/* Protective sepals */}
            <g
              className="transition-all duration-1000 ease-out"
              style={{
                transformOrigin: '0px 0px',
                transformBox: 'view-box',
                transform: isBloomed ? 'scale(0.9) rotate(15deg)' : 'scale(1.05) rotate(0deg)',
                opacity: isBloomed ? 0.4 : 0.85,
              }}
            >
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
                <path
                  key={`sep-${idx}`}
                  d="M -8,0 C -16,-30 -10,-60 0,-78 C 10,-60 16,-30 8,0 Z"
                  fill="#365314"
                  transform={`rotate(${angle})`}
                />
              ))}
            </g>

            {/* OUTER LAYER: Primary Sunflower Petals (Radial 360° Anchored Bloom) */}
            <g>
              {Array.from({ length: petalCount }).map((_, idx) => {
                const angle = (idx * 360) / petalCount;
                const scaleY = isBloomed ? 1.05 : 0.45;
                const scaleX = isBloomed ? 1.0 : 0.62;

                return (
                  <g key={`cp-outer-${idx}`} transform={`rotate(${angle})`}>
                    <path
                      d="M 0,0 C -18,-35 -20,-75 0,-102 C 20,-75 18,-35 0,0 Z"
                      fill="url(#centerpiecePetalGrad)"
                      style={{
                        transformBox: 'fill-box',
                        transformOrigin: '50% 100%',
                        transform: `scale(${scaleX}, ${scaleY})`,
                        transition: `transform 900ms cubic-bezier(0.16, 1, 0.3, 1) ${idx * 16}ms, filter 500ms ease`,
                        filter: isBloomed ? 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.45))' : 'none',
                      }}
                    />
                  </g>
                );
              })}
            </g>

            {/* INNER LAYER: Staggered Secondary Petals */}
            <g>
              {Array.from({ length: petalCount }).map((_, idx) => {
                const angle = (idx * 360) / petalCount + 9;
                const scaleY = isBloomed ? 0.88 : 0.38;
                const scaleX = isBloomed ? 0.9 : 0.55;

                return (
                  <g key={`cp-inner-${idx}`} transform={`rotate(${angle})`}>
                    <path
                      d="M 0,0 C -14,-25 -16,-58 0,-78 C 16,-58 14,-25 0,0 Z"
                      fill="url(#centerpieceMidPetal)"
                      style={{
                        transformBox: 'fill-box',
                        transformOrigin: '50% 100%',
                        transform: `scale(${scaleX}, ${scaleY})`,
                        transition: `transform 900ms cubic-bezier(0.16, 1, 0.3, 1) ${120 + idx * 16}ms`,
                      }}
                    />
                  </g>
                );
              })}
            </g>

            {/* Seed Center & Golden Disk Floret */}
            <g
              className="transition-all duration-800 ease-out"
              style={{
                transformOrigin: '0px 0px',
                transformBox: 'view-box',
                transform: isBloomed ? 'scale(1.08)' : 'scale(0.96)',
              }}
            >
              {/* Textured Core */}
              <circle cx="0" cy="0" r="36" fill="url(#sunflowerCoreGrad)" />

              {/* Fibonacci spiral seed rings */}
              {Array.from({ length: 28 }).map((_, s) => {
                const phi = 137.5 * (Math.PI / 180);
                const r = Math.sqrt(s) * 6;
                const theta = s * phi;
                const sx = Math.cos(theta) * r;
                const sy = Math.sin(theta) * r;

                return (
                  <circle
                    key={`seed-fib-${s}`}
                    cx={sx}
                    cy={sy}
                    r="1.8"
                    fill={s % 3 === 0 ? '#F59E0B' : '#78350F'}
                    opacity={isBloomed ? 0.95 : 0.5}
                    className="transition-opacity duration-700"
                  />
                );
              })}

              {/* Outer Golden Corona */}
              <circle
                cx="0"
                cy="0"
                r="34"
                fill="none"
                stroke="#FEF08A"
                strokeWidth="2.5"
                strokeDasharray="3,4"
                className={`transition-opacity duration-1000 ${isBloomed ? 'opacity-90' : 'opacity-30'}`}
              />
            </g>
          </svg>
        </div>

        {/* Hover Cue */}
        <div className="mt-3 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-sans font-medium tracking-wide">
            {isBloomed ? '✨ En Pleno Florecimiento ✨' : '🌸 Pasa el cursor para abrir los pétalos 🌸'}
          </span>
        </div>
      </div>

      {/* Interactive Action Pills for the Sunflower */}
      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={handleSunbeamBath}
          id="btn-sunbeam-bath"
          className="px-3 py-1.5 rounded-full bg-amber-950/70 hover:bg-amber-900 border border-amber-500/30 text-amber-200 text-xs font-sans flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
          title="Bañar el girasol con luz dorada"
        >
          <Sun className="w-3.5 h-3.5 text-yellow-300" />
          <span>Bañar de Luz</span>
        </button>

        <button
          onClick={handleNextQuote}
          id="btn-next-quote"
          className="px-3 py-1.5 rounded-full bg-amber-950/70 hover:bg-amber-900 border border-amber-500/30 text-amber-200 text-xs font-sans flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
          title="Cambiar mensaje o dedicatoria"
        >
          <Heart className="w-3.5 h-3.5 text-rose-300" />
          <span>Cambiar Mensaje</span>
        </button>
      </div>

      {/* Romantic Quote Card */}
      <div className="mt-5 w-full max-w-md p-4 rounded-xl bg-amber-950/50 backdrop-blur-md border border-amber-500/20 text-center shadow-lg">
        <p className="font-serif italic text-sm sm:text-base text-amber-100 transition-all duration-500">
          {ROMANTIC_QUOTES[quoteIndex]}
        </p>
        <span className="text-[10px] text-amber-300/60 font-sans tracking-widest uppercase block mt-2">
          Tradición del 21 de Septiembre
        </span>
      </div>
    </div>
  );
};
