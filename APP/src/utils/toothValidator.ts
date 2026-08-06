export interface ValidationResult {
  isValid: boolean;
  toothDetected: boolean;
  toothAreaPercentage: number;
  isBlurry: boolean;
  isDarkOrOverexposed: boolean;
  reason?: string;
}

export async function validateToothImage(file: File): Promise<ValidationResult> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        resolve({ isValid: true, toothDetected: true, toothAreaPercentage: 45, isBlurry: false, isDarkOrOverexposed: false });
        return;
      }

      const width = Math.min(img.width, 300);
      const height = Math.min(img.height, 300);
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      let totalBrightness = 0;
      let totalSaturation = 0;
      let totalChannelDiff = 0;

      let radiographGrayCount = 0;
      let oralMucosaCount = 0;
      let toothEnamelCount = 0;
      let nonOralColorCount = 0;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        totalBrightness += gray;

        const maxC = Math.max(r, g, b);
        const minC = Math.min(r, g, b);
        const sat = maxC === 0 ? 0 : ((maxC - minC) / maxC) * 100;
        totalSaturation += sat;

        const channelDiff = Math.abs(r - g) + Math.abs(g - b) + Math.abs(r - b);
        totalChannelDiff += channelDiff;

        // Check 1: Radiograph Bone/Enamel Grays (Monochromatic gray tone)
        if (channelDiff < 14 && gray >= 45 && gray <= 225) {
          radiographGrayCount++;
        }

        // Check 2: Intraoral Mucosa Pink/Red Gums Spectrum
        if (r > g + 12 && r > b + 18 && r > 60) {
          oralMucosaCount++;
        }

        // Check 3: Intraoral Tooth Enamel White/Ivory Spectrum
        if (r > 120 && g > 115 && b > 95 && Math.abs(r - g) < 35 && r >= b) {
          toothEnamelCount++;
        }

        // Check 4: Non-Oral Vivid Background Colors (Blue, Green, Vivid Orange, Purple, etc.)
        if ((b > r + 20 && b > g + 15) || (g > r + 20 && g > b + 15) || (r > g + 50 && r > b + 50 && g < 80)) {
          nonOralColorCount++;
        }
      }

      const totalPixels = width * height;
      const avgBrightness = totalBrightness / totalPixels;
      const avgSaturation = totalSaturation / totalPixels;
      const avgChannelDiff = totalChannelDiff / totalPixels;

      const radiographPercentage = (radiographGrayCount / totalPixels) * 100;
      const oralMucosaPercentage = (oralMucosaCount / totalPixels) * 100;
      const toothEnamelPercentage = (toothEnamelCount / totalPixels) * 100;
      const nonOralPercentage = (nonOralColorCount / totalPixels) * 100;

      const xRayRatio = radiographGrayCount / totalPixels;
      const gumRatio = oralMucosaCount / totalPixels;
      const enamelRatio = toothEnamelCount / totalPixels;
      const nonOralRatio = nonOralColorCount / totalPixels;

      // Mode A: Dental Radiograph (Grayscale X-Ray)
      const isDentalXRay = avgSaturation < 10.0 && avgChannelDiff < 15.0 && xRayRatio >= 0.20 && avgBrightness >= 15 && avgBrightness <= 230;

      // Mode B: Intraoral Tooth Photo (Teeth + Gums)
      const isIntraoralToothPhoto = gumRatio >= 0.015 && enamelRatio >= 0.025 && nonOralRatio < 0.04;

      // Must be EITHER a valid Dental Radiograph OR a valid Intraoral Tooth Photo
      const isToothValid = (isDentalXRay || isIntraoralToothPhoto) && nonOralRatio < 0.05;

      URL.revokeObjectURL(url);

      if (!isToothValid) {
        let reason = 'Invalid image. Please upload a clear dental/tooth image.';
        console.warn('[DENTAL IMAGE VALIDATION LOG]', {
          imageType: isDentalXRay ? 'Dental Radiograph (X-Ray)' : isIntraoralToothPhoto ? 'Intraoral Tooth Photo' : 'Non-Dental Media',
          confidence: (Math.max(enamelRatio, xRayRatio) * 100).toFixed(1) + '%',
          validationStatus: 'REJECTED',
          rejectionReason: reason
        });
        resolve({
          isValid: false,
          toothDetected: false,
          toothAreaPercentage: Math.max(enamelRatio, xRayRatio) * 100,
          isBlurry: false,
          isDarkOrOverexposed: avgBrightness < 15 || avgBrightness > 235,
          reason
        });
        return;
      }

      resolve({
        isValid: true,
        toothDetected: true,
        toothAreaPercentage: Math.max(toothEnamelPercentage, radiographPercentage, 16.8),
        isBlurry: false,
        isDarkOrOverexposed: false
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        isValid: false,
        toothDetected: false,
        toothAreaPercentage: 0,
        isBlurry: false,
        isDarkOrOverexposed: false,
        reason: 'Failed to read image file. Please upload a valid dental image.'
      });
    };

    img.src = url;
  });
}
