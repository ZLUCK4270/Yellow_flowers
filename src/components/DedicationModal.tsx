import React, { useState } from 'react';
import { DedicationMessage } from '../types';
import { X, Heart, Send, Copy, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { flowerAudio } from '../audio/flowerSynthesizer';

interface DedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDedication?: DedicationMessage;
}

const PRESET_MESSAGES = [
  'El 21 de septiembre florece todo lo que siento por ti. ¡Feliz día de las flores amarillas!',
  'Y ella sabía que él sabía, que vendría a buscarla con sus flores amarillas. Te quiero con toda mi alma.',
  'Un ramo de flores amarillas para la persona que ilumina cada uno de mis días.',
  'Que en esta primavera tu vida se llene de luz dorada, sueños cumplidos y momentos felices.',
  'Nunca olvides lo especial e increíble que eres para mí.',
];

export const DedicationModal: React.FC<DedicationModalProps> = ({
  isOpen,
  onClose,
  initialDedication,
}) => {
  const [recipient, setRecipient] = useState(initialDedication?.recipient || 'Mi amor');
  const [sender, setSender] = useState(initialDedication?.sender || 'Tu admirador');
  const [message, setMessage] = useState(
    initialDedication?.message ||
      'Y ella sabía que él sabía, que vendría a buscarla con sus flores amarillas. ¡Feliz 21 de septiembre!'
  );
  const [isLetterOpen, setIsLetterOpen] = useState(Boolean(initialDedication));
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleOpenLetter = () => {
    setIsLetterOpen(true);
    flowerAudio.playBloomChime(1.3);

    // Golden confetti shower
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FACC15', '#F59E0B', '#FDE047', '#FEF08A'],
    });
  };

  const handleCopyShareLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('para', recipient);
    url.searchParams.set('de', sender);
    url.searchParams.set('msg', message);

    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    flowerAudio.playBloomChime(1.5);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-lg rounded-2xl bg-amber-950/95 border border-amber-500/30 p-6 shadow-2xl text-amber-50 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          id="btn-close-modal"
          className="absolute top-4 right-4 p-1.5 rounded-full bg-amber-900/40 text-amber-300 hover:text-white hover:bg-amber-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isLetterOpen ? (
          /* Sealed Envelope View */
          <div className="text-center py-6">
            <div className="inline-block p-3 rounded-full bg-amber-500/20 text-yellow-300 mb-4 glow-gold">
              <Heart className="w-8 h-8 fill-amber-400 text-amber-500 animate-pulse" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-amber-100 mb-2">
              Tienes una Carta con Flores Amarillas
            </h3>
            <p className="font-sans text-xs text-amber-200/80 mb-6 max-w-sm mx-auto">
              Alguien preparó una dedicatoria especial de primavera para ti con aroma a atardecer.
            </p>

            {/* Realistic Golden Envelope Graphic */}
            <div
              onClick={handleOpenLetter}
              className="relative w-64 h-40 mx-auto bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 rounded-lg shadow-xl border border-amber-400/50 flex items-center justify-center cursor-pointer group hover:scale-105 transition-all duration-300"
            >
              {/* Envelope Flap Lines */}
              <div className="absolute inset-0 border-t-[80px] border-t-amber-500/40 border-l-[128px] border-l-transparent border-r-[128px] border-r-transparent pointer-events-none" />

              {/* Golden Wax Seal */}
              <div className="relative z-10 w-14 h-14 rounded-full bg-gradient-to-tr from-amber-700 to-yellow-400 border-2 border-amber-200 shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-amber-950" />
              </div>

              <span className="absolute bottom-2 font-script text-amber-200 text-sm">
                Toca el sello para abrir
              </span>
            </div>

            <div className="mt-8">
              <button
                onClick={handleOpenLetter}
                id="btn-open-envelope"
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-amber-950 font-sans font-bold text-sm tracking-wide shadow-lg shadow-amber-400/30 transition-all cursor-pointer"
              >
                Abrir mi Carta
              </button>
            </div>
          </div>
        ) : (
          /* Unfolded Parchment Letter View & Customizer */
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/20 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <h3 className="font-serif text-lg font-bold text-amber-100">
                  Dedicatoria del 21 de Septiembre
                </h3>
              </div>
              <button
                onClick={() => setIsLetterOpen(false)}
                className="text-xs text-amber-300 underline hover:text-amber-100 cursor-pointer"
              >
                Cerrar sobre
              </button>
            </div>

            {/* Parchment Styled Letter Card */}
            <div className="p-4 sm:p-5 rounded-xl bg-amber-100 text-amber-950 shadow-inner font-serif relative overflow-hidden border border-amber-300">
              <div className="absolute top-1 right-2 text-3xl opacity-20 pointer-events-none">
                🌻
              </div>

              {/* Form / Inputs */}
              <div className="space-y-3 font-sans">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1">
                    <label className="text-[11px] font-semibold text-amber-900 block mb-1">
                      Para:
                    </label>
                    <input
                      type="text"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-md bg-white/80 border border-amber-300 text-xs text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Nombre del destinatario"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="text-[11px] font-semibold text-amber-900 block mb-1">
                      De:
                    </label>
                    <input
                      type="text"
                      value={sender}
                      onChange={(e) => setSender(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-md bg-white/80 border border-amber-300 text-xs text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Tu nombre o firma"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-amber-900">
                      Mensaje especial:
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const randomPreset =
                          PRESET_MESSAGES[Math.floor(Math.random() * PRESET_MESSAGES.length)];
                        setMessage(randomPreset);
                      }}
                      className="text-[10px] text-amber-700 underline hover:text-amber-900 cursor-pointer"
                    >
                      Mensaje aleatorio
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-2.5 rounded-md bg-white/80 border border-amber-300 text-xs text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none font-serif text-sm leading-relaxed"
                    placeholder="Escribe tu dedicatoria..."
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-amber-300/60 text-[11px] text-amber-800">
                  <span>🌻 Flor virtual entregada</span>
                  <span className="font-script text-base text-amber-900 font-bold">
                    Con amor infinito
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleCopyShareLink}
                id="btn-copy-share"
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-amber-950 font-sans font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-900" />
                    <span>¡Enlace copiado al portapapeles!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Enlace para Compartir</span>
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl bg-amber-900/60 hover:bg-amber-800 text-amber-200 font-sans font-medium text-xs transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
