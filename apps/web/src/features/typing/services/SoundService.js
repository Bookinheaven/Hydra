// Sound profiles for different mechanical keyboard aesthetics
const SOUND_PROFILES = {
  // Default: gentle mechanical click
  mechanical: {
    click: { type: 'triangle', freq: 320, endFreq: 80, duration: 0.04, gain: 0.12 },
    error: { type: 'sawtooth', freq: 150, endFreq: 60, duration: 0.12, gain: 0.15 },
    space: { type: 'sine', freq: 200, endFreq: 100, duration: 0.06, gain: 0.10 },
    complete: { type: 'sine', freq: 520, endFreq: 880, duration: 0.25, gain: 0.12 },
  },
  // Typewriter: deeper, chunkier sound
  typewriter: {
    click: { type: 'square', freq: 180, endFreq: 50, duration: 0.035, gain: 0.08 },
    error: { type: 'sawtooth', freq: 120, endFreq: 40, duration: 0.14, gain: 0.12 },
    space: { type: 'triangle', freq: 100, endFreq: 40, duration: 0.08, gain: 0.10 },
    complete: { type: 'triangle', freq: 440, endFreq: 660, duration: 0.30, gain: 0.10 },
  },
  // Cherry MX Blue: bright, tactile
  cherry: {
    click: { type: 'triangle', freq: 600, endFreq: 200, duration: 0.025, gain: 0.10 },
    error: { type: 'square', freq: 200, endFreq: 80, duration: 0.10, gain: 0.12 },
    space: { type: 'triangle', freq: 350, endFreq: 150, duration: 0.05, gain: 0.09 },
    complete: { type: 'sine', freq: 660, endFreq: 1100, duration: 0.20, gain: 0.10 },
  },
  // Soft: subtle, quiet
  soft: {
    click: { type: 'sine', freq: 250, endFreq: 120, duration: 0.03, gain: 0.06 },
    error: { type: 'sine', freq: 180, endFreq: 80, duration: 0.10, gain: 0.08 },
    space: { type: 'sine', freq: 180, endFreq: 90, duration: 0.04, gain: 0.05 },
    complete: { type: 'sine', freq: 440, endFreq: 880, duration: 0.30, gain: 0.06 },
  },
  // Neon: futuristic, high-pitched
  neon: {
    click: { type: 'sawtooth', freq: 800, endFreq: 300, duration: 0.02, gain: 0.06 },
    error: { type: 'square', freq: 300, endFreq: 100, duration: 0.08, gain: 0.10 },
    space: { type: 'sawtooth', freq: 500, endFreq: 200, duration: 0.03, gain: 0.05 },
    complete: { type: 'sawtooth', freq: 880, endFreq: 1400, duration: 0.18, gain: 0.07 },
  },
};

class SoundServiceClass {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.profile = 'mechanical';
  }

  _init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setProfile(profileName) {
    if (SOUND_PROFILES[profileName]) {
      this.profile = profileName;
    }
  }

  getProfileNames() {
    return Object.keys(SOUND_PROFILES);
  }

  _play(sound) {
    if (!this.enabled) return;
    this._init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = sound.type;
      osc.frequency.setValueAtTime(sound.freq, now);
      osc.frequency.exponentialRampToValueAtTime(sound.endFreq, now + sound.duration);

      gain.gain.setValueAtTime(sound.gain, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + sound.duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + sound.duration);
    } catch (e) {
      // Ignore audio errors
    }
  }

  playClick() {
    const profile = SOUND_PROFILES[this.profile] || SOUND_PROFILES.mechanical;
    this._play(profile.click);
  }

  playError() {
    const profile = SOUND_PROFILES[this.profile] || SOUND_PROFILES.mechanical;
    this._play(profile.error);
  }

  playSpace() {
    const profile = SOUND_PROFILES[this.profile] || SOUND_PROFILES.mechanical;
    this._play(profile.space);
  }

  playComplete() {
    const profile = SOUND_PROFILES[this.profile] || SOUND_PROFILES.mechanical;
    this._play(profile.complete);
  }
}

export const SoundService = new SoundServiceClass();
