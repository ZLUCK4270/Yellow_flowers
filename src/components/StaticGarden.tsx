import React, { useState } from 'react';
import { FlowerData } from '../types';
import { InteractiveFlower } from './InteractiveFlower';
import { Sparkles, SunMedium, RotateCcw } from 'lucide-react';
import { flowerAudio } from '../audio/flowerSynthesizer';

const GARDEN_FLOWERS: FlowerData[] = [
  {
    id: 'flower-girasol-1',
    name: 'Girasol Imperial',
    scientificName: 'Helianthus annuus',
    meaning: 'Amor eterno y devoción',
    quote: 'Siempre buscando tu luz, como el girasol al sol.',
    type: 'sunflower',
  },
  {
    id: 'flower-margarita-2',
    name: 'Margarita Silvestre',
    scientificName: 'Bellis aurea',
    meaning: 'Alegría y nuevos comienzos',
    quote: 'La inocencia de un te quiero sincero.',
    type: 'daisy',
  },
  {
    id: 'flower-rosa-3',
    name: 'Rosa Dorada',
    scientificName: 'Rosa lutea',
    meaning: 'Calidez y amistad infinita',
    quote: 'Para iluminar cada rincón de tus días.',
    type: 'rose',
  },
  {
    id: 'flower-tulipan-4',
    name: 'Tulipán del Sol',
    scientificName: 'Tulipa aurea',
    meaning: 'Promesas de primavera',
    quote: 'El 21 de septiembre todo vuelve a florecer.',
    type: 'tulip',
  },
  {
    id: 'flower-girasol-5',
    name: 'Girasol de Medianoche',
    scientificName: 'Helianthus aureus',
    meaning: 'Fidelidad inquebrantable',
    quote: 'Ella sabía que él vendría con sus flores amarillas.',
    type: 'sunflower',
  },
];

interface StaticGardenProps {
  onFlowerClick?: (flower: FlowerData) => void;
}

export const StaticGarden: React.FC<StaticGardenProps> = () => {
  const [bloomAll, setBloomAll] = useState(false);

  const handleToggleBloomAll = () => {
    setBloomAll((prev) => {
      const next = !prev;
      if (next) {
        flowerAudio.playBloomChime(1.1);
        setTimeout(() => flowerAudio.playBloomChime(1.3), 150);
        setTimeout(() => flowerAudio.playBloomChime(1.5), 300);
      }
      return next;
    });
  };

  return (
    <section className="relative z-10 w-full max-w-6xl mx-auto px-4 py-8">
      {/* Garden Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-amber-500/20 backdrop-blur-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
              <SunMedium className="w-4 h-4" />
            </span>
            <h3 className="font-serif text-xl md:text-2xl font-bold text-amber-100 tracking-wide">
              Jardín Botánico de Flores Amarillas
            </h3>
          </div>
          <p className="text-xs md:text-sm text-amber-200/80 font-sans mt-1">
            Pasa el cursor sobre cada flor para admirar su florecimiento delicado y escuchar su melodía.
          </p>
        </div>

        {/* Action Button: Bloom All / Close */}
        <button
          onClick={handleToggleBloomAll}
          id="btn-bloom-all"
          className="group px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-amber-950 font-sans font-semibold text-xs tracking-wider uppercase transition-all duration-300 shadow-lg shadow-amber-500/25 flex items-center gap-2 cursor-pointer active:scale-95"
        >
          {bloomAll ? (
            <>
              <RotateCcw className="w-3.5 h-3.5 transition-transform group-hover:-rotate-90" />
              <span>Cerrar pétalos</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 transition-transform group-hover:scale-125" />
              <span>Florecer Todo el Jardín</span>
            </>
          )}
        </button>
      </div>

      {/* Flowerbed Grid */}
      <div className="relative rounded-2xl bg-amber-950/40 backdrop-blur-md border border-amber-500/20 p-4 md:p-6 shadow-2xl shadow-black/40">
        {/* Soft garden soil & grass silhouette base */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-emerald-950/60 to-transparent rounded-b-2xl pointer-events-none" />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 justify-items-center">
          {GARDEN_FLOWERS.map((flower) => (
            <InteractiveFlower
              key={flower.id}
              flower={flower}
              forceBloomed={bloomAll}
            />
          ))}
        </div>

        {/* Helpful user tip banner */}
        <div className="mt-4 pt-3 border-t border-amber-500/10 text-center">
          <p className="text-[11px] text-amber-300/70 font-sans italic">
            Tip mágico: Haz clic en cualquier flor para dejarla florecida permanentemente o toca la pantalla para liberar lluvia de pétalos.
          </p>
        </div>
      </div>
    </section>
  );
};
