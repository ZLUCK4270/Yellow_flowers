import React from 'react';
import { Sparkles, Heart, Sun, Volume2, VolumeX, Mail, BookOpen } from 'lucide-react';
import { SunsetPhase } from '../types';
import { RainIntensity } from './FlowerRainCanvas';

interface HeroHeaderProps {
  currentPhase: SunsetPhase;
  onCyclePhase: () => void;
  rainIntensity: RainIntensity;
  onCycleRain: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  onOpenDedication: () => void;
  onOpenHistory: () => void;
}

const PHASE_LABELS: Record<SunsetPhase, string> = {
  goldenHour: 'Dorado Mágico',
  deepSunset: 'Rosa y Coral',
  twilight: 'Crepúsculo Violeta',
  radiantDusk: 'Noche Cálida',
};

const RAIN_LABELS: Record<RainIntensity, string> = {
  gentle: 'Lluvia: Suave',
  normal: 'Lluvia: Encantadora',
  storm: 'Lluvia: Tormenta Dorada',
};

export const HeroHeader: React.FC<HeroHeaderProps> = ({
  currentPhase,
  onCyclePhase,
  rainIntensity,
  onCycleRain,
  isMusicPlaying,
  onToggleMusic,
  onOpenDedication,
  onOpenHistory,
}) => {
  return (
    <header className="relative z-10 w-full max-w-5xl mx-auto px-4 pt-8 md:pt-12 pb-6 text-center select-none">
      {/* Date badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 backdrop-blur-md text-amber-200 text-xs md:text-sm font-sans font-medium mb-4 glow-gold animate-shimmer">
        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
        <span>21 de Septiembre • Bienvenida Primavera & Flores Amarillas</span>
        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
      </div>

      {/* Main Display Typography */}
      <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white text-gold-shadow leading-tight">
        Feliz 21 de Septiembre
      </h1>

      <p className="font-script text-2xl sm:text-3xl md:text-4xl text-amber-200 mt-2 tracking-wide text-gold-shadow">
        "Flores amarillas para iluminar tu corazón"
      </p>

      {/* Poetic verse */}
      <p className="max-w-xl mx-auto font-sans text-xs sm:text-sm md:text-base text-amber-100/90 mt-3 leading-relaxed drop-shadow-sm">
        Un recordatorio eterno de cariño, vitalidad y sonrisas. Toca la pantalla para invocar pétalos al viento, escucha la melodía o pasa el cursor para hacer florecer el jardín.
      </p>

      {/* Interactive Controls Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6">
        {/* Toggle Music */}
        <button
          onClick={onToggleMusic}
          id="btn-toggle-music"
          className={`px-3.5 py-2 rounded-full text-xs font-sans font-medium flex items-center gap-2 transition-all duration-300 backdrop-blur-md cursor-pointer border ${
            isMusicPlaying
              ? 'bg-amber-400 text-amber-950 border-amber-300 shadow-md shadow-amber-500/30'
              : 'bg-amber-950/60 text-amber-200 border-amber-500/30 hover:bg-amber-900/60'
          }`}
          title="Música de Flores Amarillas"
        >
          {isMusicPlaying ? (
            <>
              <Volume2 className="w-3.5 h-3.5 animate-pulse text-amber-950" />
              <span>Música activa ♫</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-amber-300" />
              <span>Activar música</span>
            </>
          )}
        </button>

        {/* Change Sunset Phase */}
        <button
          onClick={onCyclePhase}
          id="btn-cycle-sunset"
          className="px-3.5 py-2 rounded-full text-xs font-sans font-medium flex items-center gap-2 bg-amber-950/60 text-amber-200 border border-amber-500/30 hover:bg-amber-900/60 backdrop-blur-md transition-all cursor-pointer active:scale-95"
          title="Cambiar tono del atardecer"
        >
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span>Atardecer: {PHASE_LABELS[currentPhase]}</span>
        </button>

        {/* Rain Intensity */}
        <button
          onClick={onCycleRain}
          id="btn-cycle-rain"
          className="px-3.5 py-2 rounded-full text-xs font-sans font-medium flex items-center gap-2 bg-amber-950/60 text-amber-200 border border-amber-500/30 hover:bg-amber-900/60 backdrop-blur-md transition-all cursor-pointer active:scale-95"
          title="Cambiar cantidad de flores cayendo"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          <span>{RAIN_LABELS[rainIntensity]}</span>
        </button>

        {/* Dedication Card */}
        <button
          onClick={onOpenDedication}
          id="btn-open-dedication"
          className="px-4 py-2 rounded-full text-xs font-sans font-semibold flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-amber-950 shadow-lg shadow-amber-400/25 transition-all cursor-pointer active:scale-95"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Regalar Flores (Dedicatoria)</span>
        </button>

        {/* History & Tradition Info */}
        <button
          onClick={onOpenHistory}
          id="btn-open-history"
          className="p-2 rounded-full bg-amber-950/60 text-amber-200 border border-amber-500/30 hover:bg-amber-900/60 backdrop-blur-md transition-all cursor-pointer"
          title="¿Por qué se regalan flores amarillas el 21 de septiembre?"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-300" />
        </button>
      </div>
    </header>
  );
};
