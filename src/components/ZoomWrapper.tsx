import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Platform,
  TouchableOpacity,
  Text,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  clamp,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useZoom } from '../contexts/ZoomContext';
import { MIN_SCALE, MAX_SCALE } from '../contexts/ZoomContext';

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 200,
  mass: 0.5,
};

const STEP = 0.25;

interface ZoomWrapperProps {
  children: React.ReactNode;
}

const ZoomWrapper: React.FC<ZoomWrapperProps> = ({ children }) => {
  const { setScale } = useZoom();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // Animated shared values — single source of truth for animation
  const scaleValue = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTransX = useSharedValue(0);
  const savedTransY = useSharedValue(0);

  // UI state for button enable/disable & reset button visibility (web only)
  const [displayScale, setDisplayScale] = useState(1);

  // ── Button handlers (used on web) ─────────────────────────────────────────
  const handleZoomIn = () => {
    const next = Math.min(scaleValue.value + STEP, MAX_SCALE);
    scaleValue.value = withSpring(next, SPRING_CONFIG);
    savedScale.value = next;
    setScale(next);
    setDisplayScale(next);
  };

  const handleZoomOut = () => {
    const next = Math.max(scaleValue.value - STEP, MIN_SCALE);
    scaleValue.value = withSpring(next, SPRING_CONFIG);
    savedScale.value = next;
    if (next <= 1) {
      translateX.value = withSpring(0, SPRING_CONFIG);
      translateY.value = withSpring(0, SPRING_CONFIG);
      savedTransX.value = 0;
      savedTransY.value = 0;
    }
    setScale(next);
    setDisplayScale(next);
  };

  const handleReset = () => {
    scaleValue.value = withSpring(1, SPRING_CONFIG);
    savedScale.value = 1;
    translateX.value = withSpring(0, SPRING_CONFIG);
    translateY.value = withSpring(0, SPRING_CONFIG);
    savedTransX.value = 0;
    savedTransY.value = 0;
    setScale(1);
    setDisplayScale(1);
  };

  // Keep a stable ref to avoid stale closures in the wheel listener
  const wheelHandlerRef = useRef<((e: any) => void) | undefined>(undefined);
  wheelHandlerRef.current = (e: any) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      if (e.deltaY < 0) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    }
  };

  // Web: Ctrl+Scroll wheel to zoom in/out
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const handler = (e: Event) => wheelHandlerRef.current?.(e);
    window.addEventListener('wheel', handler, { passive: false } as any);
    return () => window.removeEventListener('wheel', handler);
  }, []);

  // ── Pinch gesture ──────────────────────────────────────────────────────────
  const pinchGesture = Gesture.Pinch()
    .onBegin(() => {
      savedScale.value = scaleValue.value;
    })
    .onUpdate((e) => {
      scaleValue.value = clamp(savedScale.value * e.scale, MIN_SCALE, MAX_SCALE);
    })
    .onEnd(() => {
      const finalScale = scaleValue.value;
      savedScale.value = finalScale;

      // Snap back to 1 if pinched close to normal
      if (finalScale < 1.08) {
        scaleValue.value = withSpring(1, SPRING_CONFIG);
        savedScale.value = 1;
        translateX.value = withSpring(0, SPRING_CONFIG);
        translateY.value = withSpring(0, SPRING_CONFIG);
        savedTransX.value = 0;
        savedTransY.value = 0;
        runOnJS(setScale)(1);
        runOnJS(setDisplayScale)(1);
      } else {
        runOnJS(setScale)(finalScale);
        runOnJS(setDisplayScale)(finalScale);
      }
    });

  // ── 2-finger pan (to move around when zoomed) ───────────────────────────
  const panGesture = Gesture.Pan()
    .minPointers(2)
    .onBegin(() => {
      savedTransX.value = translateX.value;
      savedTransY.value = translateY.value;
    })
    .onUpdate((e) => {
      if (scaleValue.value > 1) {
        const maxX = ((scaleValue.value - 1) * screenWidth) / 2;
        const maxY = ((scaleValue.value - 1) * screenHeight) / 2;
        translateX.value = clamp(
          savedTransX.value + e.translationX,
          -maxX,
          maxX
        );
        translateY.value = clamp(
          savedTransY.value + e.translationY,
          -maxY,
          maxY
        );
      }
    })
    .onEnd(() => {
      savedTransX.value = translateX.value;
      savedTransY.value = translateY.value;
    });

  const composed = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scaleValue.value },
    ],
  }));

  const isZoomed = displayScale > 1.05;

  return (
    <View style={styles.container}>
      <GestureDetector gesture={composed}>
        <Animated.View style={[styles.content, animatedStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>

      {/* Zoom controls — visible on web (buttons replace pinch gesture) */}
      {Platform.OS === 'web' && (
        <View style={styles.zoomControls} pointerEvents="box-none">
          {isZoomed && (
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={handleReset}
              activeOpacity={0.8}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.resetBtnText}>✕</Text>
            </TouchableOpacity>
          )}
          <View style={styles.stepPill}>
            <TouchableOpacity
              style={[styles.stepBtn, displayScale <= MIN_SCALE && styles.stepBtnDisabled]}
              onPress={handleZoomOut}
              activeOpacity={0.75}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Text style={styles.stepBtnText}>－</Text>
            </TouchableOpacity>
            <View style={styles.stepDivider} />
            <TouchableOpacity
              style={[styles.stepBtn, displayScale >= MAX_SCALE && styles.stepBtnDisabled]}
              onPress={handleZoomIn}
              activeOpacity={0.75}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Text style={styles.stepBtnText}>＋</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default ZoomWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },

  // ── Web zoom controls ───────────────────────────────────────────────────────
  zoomControls: {
    position: 'absolute',
    bottom: 24,
    right: 14,
    alignItems: 'center',
    gap: 6,
    zIndex: 9999,
  },
  resetBtn: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  stepPill: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
  },
  stepBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnDisabled: {
    opacity: 0.35,
  },
  stepBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
  },
  stepDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
});
