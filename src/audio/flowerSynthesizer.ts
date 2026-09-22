/**
 * Native Web Audio API Synthesizer for "Flores Amarillas" atmospheric soundtrack
 * and interactive crystalline flower chimes.
 */

class FlowerAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private melodyTimeout: number | null = null;
  private masterGain: GainNode | null = null;
  private currentStep = 0;

  // Romantic harmonic arpeggios in G Major / E minor (reminiscent of Flores Amarillas)
  private readonly melodyNotes = [
    392.00, 440.00, 493.88, 587.33, // G4, A4, B4, D5
    659.25, 587.33, 493.88, 440.00, // E5, D5, B4, A4
    392.00, 587.33, 659.25, 783.99, // G4, D5, E5, G5
    880.00, 783.99, 659.25, 587.33, // A5, G5, E5, D5
    493.88, 392.00, 440.00, 493.88, // B4, G4, A4, B4
    587.33, 493.88, 440.00, 392.00, // D5, B4, A4, G4
    329.63, 392.00, 493.88, 587.33, // E4, G4, B4, D5
    440.00, 493.88, 392.00, 329.63, // A4, B4, G4, E4
  ];

  private readonly chords = [
    [196.00, 293.66, 392.00], // G major chord
    [164.81, 246.94, 329.63], // E minor chord
    [174.61, 261.63, 349.23], // C major / F
    [146.83, 220.00, 293.66], // D major chord
  ];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMusic(): boolean {
    this.initContext();
    if (this.isPlaying) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public startMusic() {
    this.initContext();
    if (!this.ctx || this.isPlaying) return;
    this.isPlaying = true;
    this.currentStep = 0;
    this.scheduleNextNote();
  }

  public stopMusic() {
    this.isPlaying = false;
    if (this.melodyTimeout) {
      window.clearTimeout(this.melodyTimeout);
      this.melodyTimeout = null;
    }
  }

  private scheduleNextNote() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    const noteFreq = this.melodyNotes[this.currentStep % this.melodyNotes.length];
    
    // Play warm bell / music box tone
    this.playTone(noteFreq, 0.45, 0.08, 'sine');
    // Subtle upper harmonic for crystalline sparkle
    this.playTone(noteFreq * 2, 0.25, 0.02, 'triangle');

    // Soft bass chord every 8 notes
    if (this.currentStep % 8 === 0) {
      const chordIndex = Math.floor(this.currentStep / 8) % this.chords.length;
      const chord = this.chords[chordIndex];
      chord.forEach((freq) => {
        this.playTone(freq, 1.8, 0.03, 'sine');
      });
    }

    this.currentStep++;
    // Relaxed tempo ~ 240ms per arpeggio note
    this.melodyTimeout = window.setTimeout(() => {
      this.scheduleNextNote();
    }, 280);
  }

  private playTone(freq: number, duration: number, gainLevel: number, type: OscillatorType) {
    if (!this.ctx || !this.masterGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(gainLevel, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch {
      // Audio context might be temporarily busy
    }
  }

  /**
   * Delicate crystalline chime triggered when flowers bloom or cursor hovers
   */
  public playBloomChime(scaleFactor = 1) {
    this.initContext();
    if (!this.ctx) return;

    const baseFrequencies = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    const randomFreq = baseFrequencies[Math.floor(Math.random() * baseFrequencies.length)] * scaleFactor;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(randomFreq, now);
      osc.frequency.exponentialRampToValueAtTime(randomFreq * 1.05, now + 0.3);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.85);
    } catch {
      // Ignore if user hasn't interacted yet
    }
  }
}

export const flowerAudio = new FlowerAudioEngine();
