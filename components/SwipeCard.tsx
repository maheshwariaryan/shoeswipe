import React from 'react';
import {
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { Shoe } from '../lib/store';

const { width: W } = Dimensions.get('window');
const THRESH_X = 0.25 * W;
const THRESH_UP = -120;

// ---------- Types ----------
type Props = {
  shoe: Shoe;
  isTop: boolean;
  onSwipe: (dir: 'left' | 'right' | 'up', id: string) => void;
};

// ---------- Component ----------
export const SwipeCard: React.FC<Props> = ({ shoe, isTop, onSwipe }) => {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const rot = useSharedValue(0);

  const handleTap = () => {
    if (isTop) {
      // Navigate to shoe detail modal with shoe data as params
      router.push({
        pathname: '/shoe-detail' as any,
        params: {
          id: shoe.id,
          brand: shoe.brand,
          model: shoe.model,
          price: shoe.price.toString(),
          image: shoe.image.toString(),
        },
      });
    }
  };

  const tap = Gesture.Tap()
    .maxDuration(300)
    .onEnd(() => {
      runOnJS(handleTap)();
    });

  const pan = Gesture.Pan()
    .onUpdate(e => {
      tx.value = e.translationX;
      ty.value = e.translationY;
      rot.value = (e.translationX / W) * 12;
    })
    .onEnd(e => {
      const { translationX: dx, translationY: dy } = e;
      let dir: 'left' | 'right' | 'up' | null = null;

      if (dy < THRESH_UP) dir = 'up';
      else if (dx > THRESH_X) dir = 'right';
      else if (dx < -THRESH_X) dir = 'left';

      if (dir) {
        const toX = dir === 'left' ? -W * 1.5 : dir === 'right' ? W * 1.5 : 0;
        const toY = dir === 'up' ? -W * 2 : dy;

        // Use faster spring config for up swipe to prevent sticking
        const springConfig = dir === 'up' 
          ? { damping: 20, stiffness: 200 } 
          : {};

        tx.value = withSpring(toX, springConfig, () => runOnJS(onSwipe)(dir!, shoe.id));
        ty.value = withSpring(toY, springConfig);
      } else {
        tx.value = withSpring(0);
        ty.value = withSpring(0);
        rot.value = withSpring(0);
      }
    });

  // Pan gesture blocks tap when there's movement, but tap works for gentle taps
  const composed = Gesture.Race(tap, pan);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { rotate: `${rot.value}deg` },
      { scale: isTop ? 1 : 0.95 },
    ],
  }));

  const cardContent = (
    <Animated.View style={[styles.card, style]}>
      <Image source={shoe.image} style={styles.image} resizeMode="cover" />
    </Animated.View>
  );

  // 👇 Conditional wrapper to satisfy TS
  return isTop ? (
    <GestureDetector gesture={composed}>{cardContent}</GestureDetector>
  ) : (
    cardContent
  );
};

const CARD_W = W * 0.9;
const CARD_H = CARD_W * 1.3;

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: CARD_W,
    height: CARD_H,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
});
