import React, { createContext, useContext, useState, useCallback } from 'react';

const MIN_SCALE = 1.0;
const MAX_SCALE = 2.5;
const STEP = 0.2;

interface ZoomContextType {
  scale: number;
  setScale: (scale: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
}

const ZoomContext = createContext<ZoomContextType>({
  scale: 1,
  setScale: () => {},
  zoomIn: () => {},
  zoomOut: () => {},
  resetZoom: () => {},
  canZoomIn: true,
  canZoomOut: false,
});

export const useZoom = () => useContext(ZoomContext);

export const ZoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scale, setScaleState] = useState(1);

  const setScale = useCallback((newScale: number) => {
    const clamped = Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE);
    setScaleState(clamped);
  }, []);

  const zoomIn = useCallback(() => {
    setScaleState(prev => Math.min(prev + STEP, MAX_SCALE));
  }, []);

  const zoomOut = useCallback(() => {
    setScaleState(prev => Math.max(prev - STEP, MIN_SCALE));
  }, []);

  const resetZoom = useCallback(() => {
    setScaleState(1);
  }, []);

  return (
    <ZoomContext.Provider
      value={{
        scale,
        setScale,
        zoomIn,
        zoomOut,
        resetZoom,
        canZoomIn: scale < MAX_SCALE,
        canZoomOut: scale > MIN_SCALE,
      }}
    >
      {children}
    </ZoomContext.Provider>
  );
};

export { MIN_SCALE, MAX_SCALE };
