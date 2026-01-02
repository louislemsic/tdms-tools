/**
 * QR Code Utility
 * Handles QR code generation and download functionality
 * This file can be updated when changing QR Code API/library
 */

/**
 * Downloads a QR code as a PNG image
 * @param qrCodeElement - The container element that holds the QR code SVG
 * @param filename - Optional filename for the download (default: "qr-code.png")
 */
export function downloadQRCode(qrCodeElement: HTMLElement | null, filename: string = "qr-code.png"): void {
  if (!qrCodeElement) {
    console.error("QR code element not found");
    return;
  }

  try {
    // Get the SVG element from the QR code
    const svgElement = qrCodeElement.querySelector("svg");
    if (!svgElement) {
      console.error("SVG element not found in QR code container");
      return;
    }

    // Create a canvas to convert SVG to image
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Failed to get canvas context");
      return;
    }

    // Set canvas size (high resolution for better quality)
    const size = 512;
    canvas.width = size;
    canvas.height = size;

    // Create an image from the SVG
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // Draw white background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      // Draw the QR code
      ctx.drawImage(img, 0, 0, size, size);
      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const downloadUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(downloadUrl);
        }
        URL.revokeObjectURL(url);
      });
    };

    img.onerror = () => {
      console.error("Failed to load SVG image");
      URL.revokeObjectURL(url);
    };

    img.src = url;
  } catch (err) {
    console.error("Failed to download QR code:", err);
  }
}

