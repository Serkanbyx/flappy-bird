/* ========================================
   Sound Engine
   Generates retro-style sound effects using
   Web Audio API — no external files needed.
   ======================================== */

export type SoundName = "flap" | "score" | "hit" | "swoosh";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled = true;

  /* ---- Context management ---- */

  /**
   * Lazily create / resume AudioContext.
   * Must be called after a user gesture (browser autoplay policy).
   */
  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /* ---- Public API ---- */

  /** Toggle sound on / off and return the new state */
  toggle(): boolean {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  /** Whether sound is currently enabled */
  isEnabled(): boolean {
    return this.enabled;
  }

  /** Play a named sound effect */
  play(name: SoundName): void {
    if (!this.enabled) return;

    try {
      switch (name) {
        case "flap":
          this.playFlap();
          break;
        case "score":
          this.playScore();
          break;
        case "hit":
          this.playHit();
          break;
        case "swoosh":
          this.playSwoosh();
          break;
      }
    } catch {
      /* Silently ignore audio errors (e.g. context limit) */
    }
  }

  /* ---- Sound Generators ---- */

  /**
   * Quick upward chirp — mimics a wing flap.
   * Short sine sweep from 400→600 Hz with fast decay.
   */
  private playFlap(): void {
    const ctx = this.getContext();
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.06);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  /**
   * Retro two-tone "ding" — classic coin/point pickup sound.
   * Two quick ascending square-wave beeps.
   */
  private playScore(): void {
    const ctx = this.getContext();
    const t = ctx.currentTime;

    /* First tone – E5 (880 Hz) */
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "square";
    osc1.frequency.setValueAtTime(880, t);
    gain1.gain.setValueAtTime(0.12, t);
    gain1.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.08);

    /* Second tone – E6 (1320 Hz), slightly delayed */
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "square";
    osc2.frequency.setValueAtTime(1320, t + 0.08);
    gain2.gain.setValueAtTime(0.12, t + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(t + 0.08);
    osc2.stop(t + 0.2);
  }

  /**
   * Impact thump + noise burst — collision / death.
   * Low sine sweep (150→40 Hz) layered with a short white-noise hit.
   */
  private playHit(): void {
    const ctx = this.getContext();
    const t = ctx.currentTime;

    /* Low-frequency thump */
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.25);
    oscGain.gain.setValueAtTime(0.35, t);
    oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.3);

    /* White noise burst */
    const sampleCount = Math.floor(ctx.sampleRate * 0.12);
    const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < sampleCount; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.4;
    }
    const noise = ctx.createBufferSource();
    const noiseGain = ctx.createGain();
    noise.buffer = buffer;
    noiseGain.gain.setValueAtTime(0.18, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
    noise.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(t);
    noise.stop(t + 0.12);
  }

  /**
   * Filtered noise whoosh — menu / state transition.
   * Band-pass filtered white noise with a frequency sweep.
   */
  private playSwoosh(): void {
    const ctx = this.getContext();
    const t = ctx.currentTime;

    /* Generate noise buffer */
    const sampleCount = Math.floor(ctx.sampleRate * 0.25);
    const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < sampleCount; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    /* Band-pass filter for the whoosh character */
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.exponentialRampToValueAtTime(2500, t + 0.1);
    filter.frequency.exponentialRampToValueAtTime(400, t + 0.25);
    filter.Q.value = 1.5;

    /* Volume envelope */
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(t);
    noise.stop(t + 0.25);
  }
}

/** Singleton sound engine instance */
export const soundEngine = new SoundEngine();
