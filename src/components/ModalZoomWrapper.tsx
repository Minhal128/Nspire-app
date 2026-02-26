/**
 * ModalZoomWrapper
 * Pinch-to-zoom + ＋/－ buttons for content inside React Native <Modal> popups.
 *
 * • Spread 2 fingers  → zoom in (up to 3×)
 * • Pinch together    → zoom out (snaps back to 1× below ~1.1×)
 * • 2-finger drag     → pan while zoomed
 * • ＋/－ pill        → step zoom in/out (always visible)
 * • ✕ button          → reset to 1× (visible only when zoomed)
 */
import React, { useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const MIN_SCALE = 1;
const MAX_SCALE = 3;
const STEP      = 0.25;

function dist(t: any[]): number {
  const dx = t[0].pageX - t[1].pageX;
  const dy = t[0].pageY - t[1].pageY;
  return Math.sqrt(dx * dx + dy * dy);
}

function mid(t: any[]): { x: number; y: number } {
  return {
    x: (t[0].pageX + t[1].pageX) / 2,
    y: (t[0].pageY + t[1].pageY) / 2,
  };
}

interface ModalZoomWrapperProps {
  children: React.ReactNode;
}

const ModalZoomWrapper: React.FC<ModalZoomWrapperProps> = ({ children }) => {
  const scale      = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const scaleJS  = useRef(1);
  const transXJS = useRef(0);
  const transYJS = useRef(0);

  // Drives button re-renders
  const [displayScale, setDisplayScale] = useState(1);

  const initD       = useRef<number | null>(null);
  const scaleAnchor = useRef(1);
  const initM       = useRef<{ x: number; y: number } | null>(null);
  const txAnchor    = useRef(0);
  const tyAnchor    = useRef(0);

  const springTo = (s: number, tx: number, ty: number) => {
    scaleJS.current  = s;
    transXJS.current = tx;
    transYJS.current = ty;
    Animated.parallel([
      Animated.spring(scale,      { toValue: s,  useNativeDriver: true, tension: 150, friction: 10 }),
      Animated.spring(translateX, { toValue: tx, useNativeDriver: true, tension: 150, friction: 10 }),
      Animated.spring(translateY, { toValue: ty, useNativeDriver: true, tension: 150, friction: 10 }),
    ]).start();
    setDisplayScale(s);
  };

  const bumpScale = (delta: number) => {
    const next = Math.min(Math.max(scaleJS.current + delta, MIN_SCALE), MAX_SCALE);
    const tx = next <= 1 ? 0 : transXJS.current;
    const ty = next <= 1 ? 0 : transYJS.current;
    springTo(next, tx, ty);
  };

  const resetZoom = () => springTo(1, 0, 0);

  const panResponder = useRef(
    PanResponder.create({
      // CAPTURE phase — intercept 2-finger touches before children claim them
      onStartShouldSetPanResponderCapture: (e) => e.nativeEvent.touches.length >= 2,
      onMoveShouldSetPanResponderCapture:  (e) => e.nativeEvent.touches.length >= 2,
      onPanResponderTerminationRequest: () => false,

      onPanResponderGrant: (e) => {
        const t = e.nativeEvent.touches;
        if (t.length < 2) return;
        initD.current       = dist(t);
        scaleAnchor.current = scaleJS.current;
        initM.current       = mid(t);
        txAnchor.current    = transXJS.current;
        tyAnchor.current    = transYJS.current;
      },

      onPanResponderMove: (e) => {
        const t = e.nativeEvent.touches;
        if (t.length < 2 || initD.current === null || initM.current === null) return;

        const ratio    = dist(t) / initD.current;
        const newScale = Math.min(Math.max(scaleAnchor.current * ratio, MIN_SCALE), MAX_SCALE);
        scaleJS.current = newScale;
        scale.setValue(newScale);

        if (newScale > 1) {
          const m  = mid(t);
          const nx = txAnchor.current + (m.x - initM.current.x);
          const ny = tyAnchor.current + (m.y - initM.current.y);
          transXJS.current = nx;
          transYJS.current = ny;
          translateX.setValue(nx);
          translateY.setValue(ny);
        }
      },

      onPanResponderRelease: () => {
        initD.current = null;
        initM.current = null;
        if (scaleJS.current < 1.12) {
          springTo(1, 0, 0);
        } else {
          setDisplayScale(scaleJS.current);
        }
      },

      onPanResponderTerminate: () => {
        initD.current = null;
        initM.current = null;
      },
    })
  ).current;

  const isZoomed = displayScale > 1.05;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Zoomable content */}
      <Animated.View
        style={[styles.content, { transform: [{ translateX }, { translateY }, { scale }] }]}
      >
        {children}
      </Animated.View>

      {/* Floating zoom controls — sit above content, unaffected by transform */}
      <View style={styles.zoomControls} pointerEvents="box-none">
        {isZoomed && (
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={resetZoom}
            activeOpacity={0.8}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.resetBtnText}>✕</Text>
          </TouchableOpacity>
        )}
        <View style={styles.stepPill}>
          <TouchableOpacity
            style={[styles.stepBtn, displayScale <= MIN_SCALE && styles.stepBtnDisabled]}
            onPress={() => bumpScale(-STEP)}
            activeOpacity={0.75}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Text style={styles.stepBtnText}>－</Text>
          </TouchableOpacity>
          <View style={styles.stepDivider} />
          <TouchableOpacity
            style={[styles.stepBtn, displayScale >= MAX_SCALE && styles.stepBtnDisabled]}
            onPress={() => bumpScale(+STEP)}
            activeOpacity={0.75}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Text style={styles.stepBtnText}>＋</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ModalZoomWrapper;

const styles = StyleSheet.create({
  container: { flex: 1 },
  content:   { flex: 1 },

  // ── Floating controls ──────────────────────────────────────────────────
  zoomControls: {
    position: 'absolute',
    bottom: 76,          // above modal's footer buttons
    right: 14,
    alignItems: 'center',
    gap: 6,
  },
  resetBtn: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 2,
    alignSelf: 'center',
  },
  resetBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  stepPill: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.50)',
    borderRadius: 24,
    overflow: 'hidden',
  },
  stepBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnDisabled: {
    opacity: 0.30,
  },
  stepBtnText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 24,
  },
  stepDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.30)',
    marginVertical: 7,
  },
});

