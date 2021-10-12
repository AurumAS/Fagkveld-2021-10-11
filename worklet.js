import { mulberry32, rgbStringToHsl } from "/utils.js";

// Sjekker at Paint API-et er tilgjengelig i nettleseren.
if (typeof registerPaint !== "undefined") {
  class AurumSymbols {
    // Gir worklet-en tilgang til CSS variabler.
    // En del av Paint Worklet interfacet.
    static get inputProperties() {
      return [
        "--aurum-symbolCount",
        "--aurum-symbolColor",
        "--aurum-squareMinSize",
        "--aurum-squareMaxSize",
        "--aurum-squareAlpha",
        "--aurum-rngSeed",
      ];
    }

    // ctx - subset av 2d canvas.
    // size - dimensjonene til elementet det tegnes i.
    // properties - readonly StyleMap, for å hente ut CSS variabler.
    // args - argumenter blir sendt direkte via paint(aurum, arg1, arg2...).
    paint(ctx, size, properties, args) {
      // Propertiene er registrert i /properties.js (Properties and Values API).
      // De skal da være typet og man slipper string-konvertering.
      const colorInput = properties.get("--aurum-symbolColor");
      const symbolCount = properties.get("--aurum-symbolCount").value;
      const rngSeed = properties.get("--aurum-rngSeed").value;
      const squareMinSize = properties.get("--aurum-squareMinSize").value;
      const squareMaxSize = properties.get("--aurum-squareMaxSize").value;
      const squareAlpha = properties.get("--aurum-squareAlpha").value / 100;

      // <color> properties kommer alltid inn som RGBA.
      // Konverterer til HSL for å kunne justere lightness enkelt
      const [h, s, l] = rgbStringToHsl(colorInput);

      // 32-bit seeded RNG. Konsistent mønster på tvers av re-renders (resize, refresh, etc.).
      const random = mulberry32(rngSeed);

      for (let i = 0; i < symbolCount; i++) {
        const squareSize = random.nextBetween(squareMinSize, squareMaxSize);

        // Finner et tilfeldig sted å tegne kvadratet.
        // Passer på så det ikke går utenfor elementet det tegnes i.
        const x = random.nextBetween(0, size.width - squareSize);
        const y = random.nextBetween(0, size.height - squareSize);

        const progress = i / symbolCount;

        // Øker lightness gradvis for å gi dybde 🤷
        const lightness = Math.max(0, Math.min(100, progress * 20 + l));
        const colorString = `hsla(${h}, ${s}%, ${lightness}%, ${squareAlpha})`;
        ctx.fillStyle = colorString;
        ctx.fillRect(x, y, squareSize, squareSize);
      }
    }
  }

  // Regisrerer worklet-en.
  // Første argument er navnet på worklet-en og det man bruker i paint().
  registerPaint("aurum", AurumSymbols);
}
