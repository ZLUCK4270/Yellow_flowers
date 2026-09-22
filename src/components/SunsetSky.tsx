import React, { useEffect, useState } from 'react';
import { SunsetPhase } from '../types';

interface SunsetSkyProps {
  phaseOverride?: SunsetPhase | null;
  autoProgress?: boolean;
  onPhaseChange?: (phase: SunsetPhase) => void;
}

interface SunsetPalette {
  name: string;
  label: string;
  topColor: string;
  midColor: string;
  bottomColor: string;
  sunColor: string;
  sunGlow: string;
  sunY: number; // percentage from top
  cloudTint: string;
}

export const SUNSET_PALETTES: Record<SunsetPhase, SunsetPalette> = {
  goldenHour: {
    name: 'goldenHour',
    label: 'Atardecer Dorado (Hora Mágica)',
    topColor: '#92400e', // Amber-800
    midColor: '#d97706', // Amber-600
    bottomColor: '#f59e0b', // Amber-500
    sunColor: '#fef08a', // Yellow-200
    sunGlow: 'rgba(245, 158, 11, 0.7)',
    sunY: 42,
    cloudTint: 'rgba(254, 240, 138, 0.25)',
  },
  deepSunset: {
    name: 'deepSunset',
    label: 'Atardecer Rosa y Coral',
    topColor: '#581c87', // Purple-900
    midColor: '#be185d', // Pink-700
    bottomColor: '#f97316', // Orange-500
    sunColor: '#fed7aa', // Orange-200
    sunGlow: 'rgba(236, 72, 153, 0.65)',
    sunY: 56,
    cloudTint: 'rgba(251, 113, 133, 0.3)',
  },
  twilight: {
    name: 'twilight',
    label: 'Crepúsculo Violeta',
    topColor: '#1e1b4b', // Indigo-950
    midColor: '#701a75', // Fuchsia-900
    bottomColor: '#c2410c', // Orange-700
    sunColor: '#fca5a5', // Red-300
    sunGlow: 'rgba(194, 65, 12, 0.7)',
    sunY: 68,
    cloudTint: 'rgba(192, 132, 252, 0.22)',
  },
  radiantDusk: {
    name: 'radiantDusk',
    label: 'Noche Cálida Estrellada',
    topColor: '#090a16', // Deep night
    midColor: '#1e1b4b', // Deep indigo
    bottomColor: '#78350f', // Warm glowing horizon
    sunColor: '#fdba74',
    sunGlow: 'rgba(245, 158, 11, 0.45)',
    sunY: 78,
    cloudTint: 'rgba(253, 224, 71, 0.15)',
  },
};

const PHASES_LIST: SunsetPhase[] = ['goldenHour', 'deepSunset', 'twilight', 'radiantDusk'];

export const SunsetSky: React.FC<SunsetSkyProps> = ({
  phaseOverride,
  autoProgress = true,
  onPhaseChange,
}) => {
  const [phaseIndex, setPhaseIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0); // 0 to 1 loop progress

  // If override is provided, prioritize it
  useEffect(() => {
    if (phaseOverride) {
      const idx = PHASES_LIST.indexOf(phaseOverride);
      if (idx !== -1) {
        setPhaseIndex(idx);
      }
    }
  }, [phaseOverride]);

  // Subtle continuous sunset transition
  useEffect(() => {
    if (!autoProgress || phaseOverride) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = (prev + 0.003) % 1;
        const totalPhases = PHASES_LIST.length;
        const currentIdx = Math.floor(next * totalPhases);
        setPhaseIndex(currentIdx);
        onPhaseChange?.(PHASES_LIST[currentIdx]);
        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [autoProgress, phaseOverride, onPhaseChange]);

  const currentPhaseKey = phaseOverride || PHASES_LIST[phaseIndex];
  const palette = SUNSET_PALETTES[currentPhaseKey];

  return (
    <div className="fixed inset-0 pointer-events-none select-none -z-20 overflow-hidden">
      {/* Dynamic Smooth Sunset Sky Gradients with CSS Transitions */}
      <div
        className="absolute inset-0 transition-colors duration-3000 ease-in-out"
        style={{
          background: `linear-gradient(180deg, ${palette.topColor} 0%, ${palette.midColor} 52%, ${palette.bottomColor} 100%)`,
        }}
      />

      {/* Radiant Sun and Ambient Glow */}
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-full transition-all duration-3000 ease-out"
        style={{
          top: `${palette.sunY}%`,
          width: 'clamp(140px, 18vw, 240px)',
          height: 'clamp(140px, 18vw, 240px)',
          backgroundColor: palette.sunColor,
          boxShadow: `0 0 120px 40px ${palette.sunGlow}, 0 0 240px 80px ${palette.sunGlow}`,
          opacity: currentPhaseKey === 'radiantDusk' ? 0.35 : 0.95,
        }}
      >
        {/* Soft sun halo rings */}
        <div
          className="absolute -inset-10 rounded-full animate-pulse-glow"
          style={{
            background: `radial-gradient(circle, ${palette.sunGlow} 0%, transparent 75%)`,
          }}
        />
      </div>

      {/* Sunbeams and Warm Horizon Atmosphere */}
      <div
        className="absolute inset-x-0 bottom-0 h-[45vh] transition-opacity duration-3000 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 100%, ${palette.sunGlow} 0%, transparent 72%)`,
          opacity: 0.7,
        }}
      />

      {/* Ambient drifting clouds with sunset highlights */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
        {/* Cloud 1 */}
        <div
          className="absolute -left-20 top-[20%] w-[550px] h-[120px] rounded-full blur-2xl transition-colors duration-3000 animate-pulse"
          style={{
            backgroundColor: palette.cloudTint,
            animationDuration: '14s',
          }}
        />
        {/* Cloud 2 */}
        <div
          className="absolute right-[5%] top-[35%] w-[650px] h-[140px] rounded-full blur-3xl transition-colors duration-3000 animate-pulse"
          style={{
            backgroundColor: palette.cloudTint,
            animationDuration: '18s',
            animationDelay: '3s',
          }}
        />
        {/* Cloud 3 */}
        <div
          className="absolute left-[25%] top-[50%] w-[700px] h-[160px] rounded-full blur-3xl transition-colors duration-3000"
          style={{
            backgroundColor: palette.cloudTint,
          }}
        />
      </div>

      {/* Twinkling evening stars when approaching dusk */}
      <div
        className="absolute inset-0 transition-opacity duration-3000 pointer-events-none"
        style={{
          opacity: currentPhaseKey === 'radiantDusk' ? 0.85 : currentPhaseKey === 'twilight' ? 0.45 : 0.05,
        }}
      >
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-amber-100 animate-pulse"
            style={{
              top: `${(i * 19) % 65}%`,
              left: `${(i * 37) % 98}%`,
              width: `${(i % 3) + 1.5}px`,
              height: `${(i % 3) + 1.5}px`,
              animationDuration: `${2 + (i % 4)}s`,
              animationDelay: `${(i * 0.3) % 3}s`,
            }}
          />
        ))}
      </div>

      {/* Warm horizon silhouette mist */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-amber-950/70 via-amber-950/30 to-transparent pointer-events-none" />
    </div>
  );
};
