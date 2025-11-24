export const APP_NAME = "数学十字君";

// Default coefficients
export const DEFAULT_COEFFS = {
  A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0, K: 0
};

export const AUDIO_BASE_PATH = 'assets/audio/';

// Since we cannot actually generate files in this environment, 
// we will have a flag to fallback to Web Speech API for the demo to work.
// In a real deployment with the python script run, this would be false.
export const USE_TTS_FALLBACK = true; 

export const FORMULA_DISPLAY = [
  { key: 'A', term: 'x²' },
  { key: 'D', term: 'xy' },
  { key: 'B', term: 'y²' },
  { key: 'G', term: 'x' },
  { key: 'H', term: 'y' },
  { key: 'K', term: '' }, // Constant
  // Extended for 3 vars (Advanced Mode hidden for simplicity of UI unless needed)
  // { key: 'C', term: 'z²' },
  // { key: 'E', term: 'yz' },
  // { key: 'F', term: 'zx' },
];