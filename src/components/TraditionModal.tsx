import React from 'react';
import { X, Sparkles, Sun, Heart, Flower2 } from 'lucide-react';

interface TraditionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TraditionModal: React.FC<TraditionModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-amber-950/95 border border-amber-500/30 p-6 sm:p-8 text-amber-50 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          id="btn-close-tradition"
          className="absolute top-4 right-4 p-1.5 rounded-full bg-amber-900/40 text-amber-300 hover:text-white hover:bg-amber-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-2 text-yellow-300">
          <Flower2 className="w-6 h-6 animate-pulse" />
          <span className="font-sans text-xs uppercase tracking-widest font-semibold text-amber-300">
            Historia y Tradición
          </span>
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-amber-100 mb-4 leading-tight">
          ¿Por qué se regalan Flores Amarillas el 21 de Septiembre?
        </h3>

        <div className="space-y-4 text-xs sm:text-sm text-amber-100/90 font-sans leading-relaxed">
          <div className="p-4 rounded-xl bg-amber-900/40 border border-amber-500/20">
            <h4 className="font-serif font-bold text-amber-200 text-sm mb-1 flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-400" />
              1. La llegada de la Primavera
            </h4>
            <p>
              El 21 de septiembre coincide con el equinoccio de primavera en el hemisferio sur. Simboliza el renacimiento de la naturaleza, el despertar de los campos florecidos y el triunfo de la luz solar tras el frío invierno.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-900/40 border border-amber-500/20">
            <h4 className="font-serif font-bold text-amber-200 text-sm mb-1 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-400" />
              2. El fenómeno romántico de "Floricienta"
            </h4>
            <p>
              La icónica canción <em>"Flores Amarillas"</em> de la telenovela argentina juvenil marcó a generaciones con la promesa de que la persona amada llegaría a buscarte con un ramo de flores amarillas para jurar amor y compañía para siempre.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-900/40 border border-amber-500/20">
            <h4 className="font-serif font-bold text-amber-200 text-sm mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              3. El simbolismo del color amarillo
            </h4>
            <p>
              En la psicología del color y el lenguaje botánico, las flores amarillas (girasoles, margaritas, rosas amarillas) representan alegría pura, amistad sincera, prosperidad, optimismo y un deseo genuino de iluminar la vida de quien las recibe.
            </p>
          </div>
        </div>

        {/* Footer Quote */}
        <div className="mt-6 pt-4 border-t border-amber-500/20 text-center font-script text-xl text-amber-200">
          "Y ella sabía que él sabía, que vendría a buscarla con sus flores amarillas..."
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 font-bold text-xs uppercase tracking-wider hover:from-amber-300 hover:to-yellow-300 transition-all cursor-pointer shadow-md"
          >
            Entendido, ¡a florecer!
          </button>
        </div>
      </div>
    </div>
  );
};
