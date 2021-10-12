export const mulberry32 = (seed) => {
  let state = seed;

  const next = () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    var t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const nextBetween = (from, to) => {
    return from + (to - from) * next();
  };
  return { nextBetween, next };
};

export const rgbToHsl = (r, g, b) => {
  (r /= 255), (g /= 255), (b /= 255);
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    l = (max + min) / 2;

  if (max == min) {
    h = s = 0;
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
};

export const rgbStringToHsl = (hex) => {
  let [_, r, g, b] = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(hex);
  const hsl = rgbToHsl(parseInt(r), parseInt(g), parseInt(b));
  return hsl;
};
