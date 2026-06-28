import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ZoomIn, ZoomOut, RotateCw, Check, Upload } from 'lucide-react';

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  aspectRatio: number; // e.g. 0.75 for 3:4, 1.0 for 1:1, 1.777 for 16:9
  aspectRatioLabel: string; // e.g. "3:4 Portrait"
  onCropComplete: (croppedDataUrl: string) => void;
}

export default function ImageCropperModal({
  isOpen,
  onClose,
  imageSrc,
  aspectRatio,
  aspectRatioLabel,
  onCropComplete,
}: ImageCropperModalProps) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0); // in degrees: 0, 90, 180, 270
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Viewport display size inside the modal (fixed maximum constraints)
  const viewWidth = 280;
  const viewHeight = Math.round(viewWidth / aspectRatio);

  const baseScale = naturalSize.width > 0 
    ? Math.max(viewWidth / naturalSize.width, viewHeight / naturalSize.height) 
    : 1;
  const w = naturalSize.width * baseScale * zoom;
  const h = naturalSize.height * baseScale * zoom;

  // Reset states on new image or open
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      setRotation(0);
    }
  }, [isOpen, imageSrc]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    containerRef.current?.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.current.x;
    const newY = e.clientY - dragStart.current.y;
    setOffset({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    containerRef.current?.releasePointerCapture(e.pointerId);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
    setOffset({ x: 0, y: 0 }); // reset pan on rotate to avoid weird bounds
  };

  const getFitZoom = () => {
    if (naturalSize.width === 0) return 1;
    const fitScale = Math.min(viewWidth / naturalSize.width, viewHeight / naturalSize.height);
    return fitScale / baseScale;
  };

  const handleFit = () => {
    const fitZoom = getFitZoom();
    setZoom(fitZoom);
    setOffset({ x: 0, y: 0 });
  };

  const handleFill = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const handleResetPan = () => {
    setOffset({ x: 0, y: 0 });
  };

  const handleSaveCrop = () => {
    if (!imageRef.current || naturalSize.width === 0) return;

    // Create a high-quality destination canvas
    const canvas = document.createElement('canvas');
    const targetWidth = aspectRatio === 1 ? 400 : 800;
    const targetHeight = Math.round(targetWidth / aspectRatio);
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high-quality scaling parameters
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Clear background with white to avoid black spaces in jpeg export
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    const ratio = targetWidth / viewWidth;

    ctx.save();

    // Translate to center of canvas, rotate, and then draw image centered with offsets applied
    ctx.translate(targetWidth / 2, targetHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Draw relative to rotated canvas origin
    const drawX = (offset.x * ratio) - (w * ratio / 2);
    const drawY = (offset.y * ratio) - (h * ratio / 2);

    ctx.drawImage(
      imageRef.current,
      drawX,
      drawY,
      w * ratio,
      h * ratio
    );

    ctx.restore();

    // Export cropped image as base64 jpeg
    const croppedUrl = canvas.toDataURL('image/jpeg', 0.88);
    onCropComplete(croppedUrl);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
          {/* Backdrop closer */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white border border-stone-200 shadow-2xl rounded-2xl w-full max-w-md overflow-hidden flex flex-col z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Crop Image</h3>
                <p className="text-[10px] text-stone-400 font-medium">Aspect Ratio: {aspectRatioLabel}</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Viewport Frame */}
            <div className="flex-1 bg-stone-950 flex flex-col items-center justify-center p-8 relative min-h-[340px]">
              <p className="absolute top-3 text-[10px] text-stone-400 text-center select-none">
                Drag to position • Pinch/Slider to zoom
              </p>

              {/* Viewport Box */}
              <div
                ref={containerRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className="relative overflow-hidden border border-white/20 shadow-xl cursor-move touch-none bg-stone-900 rounded-lg"
                style={{
                  width: `${viewWidth}px`,
                  height: `${viewHeight}px`,
                }}
              >
                <img
                  ref={imageRef}
                  src={imageSrc}
                  alt="Crop preview"
                  onLoad={handleImageLoad}
                  className="absolute pointer-events-none origin-center max-w-none max-h-none select-none animate-fade-in"
                  style={{
                    width: `${w}px`,
                    height: `${h}px`,
                    transform: `translate3d(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px), 0) rotate(${rotation}deg)`,
                    left: '50%',
                    top: '50%',
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out, width 0.1s ease-out, height 0.1s ease-out',
                  }}
                />

                {/* Framing guides (Grid overlay) */}
                <div className="absolute inset-0 border border-[#FF5B22] pointer-events-none rounded-lg" />
                <div className="absolute inset-x-0 top-1/3 border-b border-white/10 pointer-events-none" />
                <div className="absolute inset-x-0 top-2/3 border-b border-white/10 pointer-events-none" />
                <div className="absolute inset-y-0 left-1/3 border-r border-white/10 pointer-events-none" />
                <div className="absolute inset-y-0 left-2/3 border-r border-white/10 pointer-events-none" />
              </div>
            </div>

            {/* Controls */}
            <div className="bg-stone-50 p-5 border-t border-stone-100 space-y-4">
              {/* Zoom slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold text-stone-500">
                  <span className="flex items-center gap-1"><ZoomOut className="w-3.5 h-3.5" /> zoom out</span>
                  <span className="text-stone-800 font-mono">{(zoom * 100).toFixed(0)}%</span>
                  <span className="flex items-center gap-1">zoom in <ZoomIn className="w-3.5 h-3.5" /></span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.01"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-[#FF5B22] h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-2 justify-center pb-1">
                <button
                  type="button"
                  onClick={handleFit}
                  className="px-2.5 py-1 text-[10px] font-bold bg-white hover:bg-stone-100 hover:text-stone-900 border border-stone-200 text-stone-600 rounded-lg transition-colors cursor-pointer"
                >
                  Fit Entire Image
                </button>
                <button
                  type="button"
                  onClick={handleFill}
                  className="px-2.5 py-1 text-[10px] font-bold bg-white hover:bg-stone-100 hover:text-stone-900 border border-stone-200 text-stone-600 rounded-lg transition-colors cursor-pointer"
                >
                  Fill Crop Area
                </button>
                <button
                  type="button"
                  onClick={handleResetPan}
                  className="px-2.5 py-1 text-[10px] font-bold bg-white hover:bg-stone-100 hover:text-stone-900 border border-stone-200 text-stone-600 rounded-lg transition-colors cursor-pointer"
                >
                  Reset Position
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleRotate}
                  className="flex items-center gap-1.5 px-3 py-2 border border-stone-200 hover:border-stone-900 bg-white text-stone-700 hover:text-stone-950 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Rotate 90°</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 hover:bg-stone-100 text-stone-600 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCrop}
                    className="flex items-center gap-1.5 px-5 py-2 bg-[#FF5B22] hover:bg-[#E04B15] text-white font-semibold rounded-xl text-xs shadow-sm transition-all cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply Crop</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
