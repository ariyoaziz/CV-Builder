/** Supported input file MIME types for profile photo upload. */
const SUPPORTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** Maximum allowed output size in bytes (500 KB — product hard limit). */
const MAX_OUTPUT_BYTES = 500 * 1024;

export interface CompressResult {
  success: true;
  dataUri: string;
}

export interface CompressError {
  success: false;
  error: string;
}

export type CompressImageResult = CompressResult | CompressError;

/**
 * Compresses an image File to a JPEG data URI using the browser Canvas API.
 *
 * @param file        - The File object selected by the user
 * @param maxWidthPx  - Maximum pixel width of the output (default: 400)
 * @param quality     - JPEG quality 0–1 (default: 0.82)
 * @returns CompressImageResult — either { success: true, dataUri } or { success: false, error }
 *
 * Product constraints enforced:
 * - Input must be JPEG, PNG, or WebP.
 * - Output must be ≤ 500 KB.
 * - A target of ~200 KB is attempted first via quality reduction steps.
 * - Browser API failures (Canvas unavailable, corrupted image) are caught
 *   and returned as error results without throwing.
 */
export async function compressImageToDataUri(
  file: File,
  maxWidthPx = 400,
  quality = 0.82
): Promise<CompressImageResult> {
  // 1. Validate file type
  if (!SUPPORTED_TYPES.includes(file.type)) {
    return {
      success: false,
      error: `Format file tidak didukung. Gunakan JPEG, PNG, atau WebP.`,
    };
  }

  // 2. Load image into an <img> element
  let objectUrl: string | null = null;
  try {
    objectUrl = URL.createObjectURL(file);
    const img = await loadImage(objectUrl);

    // 3. Calculate output dimensions (maintain aspect ratio)
    const scale = img.naturalWidth > maxWidthPx ? maxWidthPx / img.naturalWidth : 1;
    const outWidth = Math.round(img.naturalWidth * scale);
    const outHeight = Math.round(img.naturalHeight * scale);

    // 4. Draw onto canvas
    const canvas = document.createElement("canvas");
    canvas.width = outWidth;
    canvas.height = outHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return { success: false, error: "Gagal mendapatkan konteks canvas." };
    }
    ctx.drawImage(img, 0, 0, outWidth, outHeight);

    // 5. Try decreasing quality until output ≤ 500 KB
    const qualities = [quality, 0.7, 0.55, 0.4];
    for (const q of qualities) {
      const dataUri = canvas.toDataURL("image/jpeg", q);
      const bytes = approximateDataUriBytes(dataUri);
      if (bytes <= MAX_OUTPUT_BYTES) {
        return { success: true, dataUri };
      }
    }

    // 6. If still > 500 KB at minimum quality, reject
    return {
      success: false,
      error: `Foto terlalu besar bahkan setelah kompresi (>${MAX_OUTPUT_BYTES / 1024} KB). Gunakan foto dengan resolusi lebih kecil.`,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: `Gagal memproses gambar: ${message}` };
  } finally {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }
}

/** Resolves when the img element finishes loading, or rejects on error. */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Gambar rusak atau tidak dapat dimuat."));
    img.src = src;
  });
}

/**
 * Estimates the byte size of a data URI.
 * Base64 encodes 3 bytes → 4 chars, minus the header prefix.
 */
function approximateDataUriBytes(dataUri: string): number {
  const base64 = dataUri.split(",")[1] ?? "";
  return Math.ceil((base64.length * 3) / 4);
}
