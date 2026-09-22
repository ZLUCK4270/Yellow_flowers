/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SunsetPhase, DedicationMessage } from './types';
import { SunsetSky } from './components/SunsetSky';
import { FlowerRainCanvas, RainIntensity } from './components/FlowerRainCanvas';
import { HeroHeader } from './components/HeroHeader';
import { CenterpieceSunflower } from './components/CenterpieceSunflower';
import { StaticGarden } from './components/StaticGarden';
import { DedicationModal } from './components/DedicationModal';
import { TraditionModal } from './components/TraditionModal';
import { flowerAudio } from './audio/flowerSynthesizer';
import { Sparkles, Flower2, Heart, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';

const SUNSET_CYCLE: SunsetPhase[] = ['goldenHour', 'deepSunset', 'twilight', 'radiantDusk'];
const RAIN_CYCLE: RainIntensity[] = ['normal', 'storm', 'gentle'];

export default function App() {
  const [currentPhase, setCurrentPhase] = useState<SunsetPhase>('goldenHour');
  const [rainIntensity, setRainIntensity] = useState<RainIntensity>('normal');
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const [isDedicationOpen, setIsDedicationOpen] = useState<boolean>(false);
  const [isTraditionOpen, setIsTraditionOpen] = useState<boolean>(false);
  const [initialDedication, setInitialDedication] = useState<DedicationMessage | undefined>(undefined);

  // Check URL search params for shared romantic dedication link
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const para = params.get('para');
      const de = params.get('de');
      const msg = params.get('msg');

      if (para || de || msg) {
        setInitialDedication({
          recipient: para || 'Para ti',
          sender: de || 'Con cariño',
          message: msg || 'Y ella sabía que él sabía, que vendría a buscarla con sus flores amarillas...',
          flowerType: 'sunflower',
          date: '21 de Septiembre',
        });
        setIsDedicationOpen(true);
      }
    } catch {
      // Ignore URL parse error in restricted sandbox
    }
  }, []);

  const handleCycleSunset = () => {
    const currentIdx = SUNSET_CYCLE.indexOf(currentPhase);
    const nextIdx = (currentIdx + 1) % SUNSET_CYCLE.length;
    setCurrentPhase(SUNSET_CYCLE[nextIdx]);
    flowerAudio.playBloomChime(1.1);
  };

  const handleCycleRain = () => {
    const currentIdx = RAIN_CYCLE.indexOf(rainIntensity);
    const nextIdx = (currentIdx + 1) % RAIN_CYCLE.length;
    setRainIntensity(RAIN_CYCLE[nextIdx]);
    flowerAudio.playBloomChime(1.2);
  };

  const handleToggleMusic = () => {
    const playing = flowerAudio.toggleMusic();
    setIsMusicPlaying(playing);
  };

  // Spectacular sunflower fireworks explosion
  const handleLaunchFireworks = () => {
    flowerAudio.playBloomChime(1.4);
    setTimeout(() => flowerAudio.playBloomChime(1.6), 180);

    const end = Date.now() + 1800;
    const colors = ['#FACC15', '#F59E0B', '#FDE047', '#FEF08A', '#EAB308'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between text-amber-50 selection:bg-amber-400 selection:text-amber-950 overflow-x-hidden font-sans">
      {/* 1. Dynamic continuous sunset sky with subtle warm transitions */}
      <SunsetSky phaseOverride={currentPhase} autoProgress={false} />

      {/* 2. Interactive rain of yellow flowers, sunflowers, and falling petals */}
      <FlowerRainCanvas intensity={rainIntensity} interactiveWind={true} />

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Top Floating Music Pill for quick mobile accessibility */}
        <div className="fixed top-4 right-4 z-40">
          <button
            onClick={handleToggleMusic}
            id="fab-music-toggle"
            className={`p-2.5 rounded-full backdrop-blur-md border shadow-lg transition-all duration-300 cursor-pointer ${
              isMusicPlaying
                ? 'bg-amber-400 text-amber-950 border-amber-300 shadow-amber-500/30'
                : 'bg-amber-950/70 text-amber-200 border-amber-500/30 hover:bg-amber-900/80'
            }`}
            title={isMusicPlaying ? 'Silenciar melodía' : 'Reproducir melodía de flores amarillas'}
          >
            {isMusicPlaying ? (
              <Volume2 className="w-4 h-4 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Hero Header & Controls */}
        <HeroHeader
          currentPhase={currentPhase}
          onCyclePhase={handleCycleSunset}
          rainIntensity={rainIntensity}
          onCycleRain={handleCycleRain}
          isMusicPlaying={isMusicPlaying}
          onToggleMusic={handleToggleMusic}
          onOpenDedication={() => setIsDedicationOpen(true)}
          onOpenHistory={() => setIsTraditionOpen(true)}
        />

        {/* Centerpiece Interactive Giant Sunflower */}
        <CenterpieceSunflower />

        {/* Botanical Garden of Interactive Static Flowers with fluid slow blooming */}
        <StaticGarden />

        {/* Celebration Bar with Sunflower Fireworks trigger */}
        <div className="my-8 text-center px-4">
          <button
            onClick={handleLaunchFireworks}
            id="btn-fireworks-celebrate"
            className="group px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-amber-950 font-serif font-bold text-sm tracking-wider uppercase shadow-xl shadow-amber-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer inline-flex items-center gap-2"
          >
            <Flower2 className="w-4 h-4 transition-transform group-hover:rotate-45" />
            <span>Celebrar con Lluvia de Fuegos Amarillos</span>
            <Sparkles className="w-4 h-4 transition-transform group-hover:scale-125" />
          </button>
        </div>
      </div>

      {/* Romantic Footer */}
      <footer className="relative z-10 py-6 text-center border-t border-amber-500/20 bg-amber-950/40 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-200/80">
          <div className="flex items-center gap-1.5 font-script text-base text-amber-200">
            <span>21 de Septiembre</span>
            <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
            <span>Día de regalar flores amarillas</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-sans">
            <button
              onClick={() => setIsTraditionOpen(true)}
              className="hover:text-amber-100 underline cursor-pointer"
            >
              Significado
            </button>
            <button
              onClick={() => setIsDedicationOpen(true)}
              className="hover:text-amber-100 underline cursor-pointer"
            >
              Enviar dedicatoria
            </button>
            <button
              onClick={handleLaunchFireworks}
              className="hover:text-amber-100 underline cursor-pointer"
            >
              Fuegos de flores
            </button>
          </div>
        </div>
      </footer>

      {/* Dedication Letter Modal with Wax Seal */}
      <DedicationModal
        isOpen={isDedicationOpen}
        onClose={() => setIsDedicationOpen(false)}
        initialDedication={initialDedication}
      />

      {/* Tradition & Folklore Modal */}
      <TraditionModal
        isOpen={isTraditionOpen}
        onClose={() => setIsTraditionOpen(false)}
      />
    </div>
  );
}
