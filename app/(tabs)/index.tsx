// app/(tabs)/index.tsx
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useStore } from '../../lib/store';
import { SwipeCard } from '../../components/SwipeCard';

// ----------------------------------------------------------------------
// Dummy shoe data for now – swap with your backend later
// ----------------------------------------------------------------------
const shoes = [
  {
    id: '1',
    brand: 'Nike',
    model: 'Air Force 1',
    price: 110,
    image: require('../../assets/shoe1.png'),
  },
  {
    id: '2',
    brand: 'Adidas',
    model: 'Ultraboost',
    price: 180,
    image: require('../../assets/shoe2.png'),
  },
  // add more items …
];

export default function Home() {
  // The stack of cards still to be swiped
  const [deck, setDeck] = useState(shoes);

  // Zustand action (adds to liked / cart)
  const swipeAction = useStore(state => state.swipe);

  // Callback invoked by SwipeCard when animation finishes
  const handleSwipe = useCallback(
    (dir: 'left' | 'right' | 'up', id: string) => {
      const swipedShoe = deck.find(s => s.id === id);
      if (!swipedShoe) return;

      // Update global state
      swipeAction(swipedShoe, dir);

      // Drop the top card
      setDeck(prev => prev.filter(s => s.id !== id));
    },
    [deck, swipeAction]
  );

  return (
    <View style={styles.container}>
      {deck.length === 0 && (
        <Text style={styles.emptyText}>You've seen them all! 🔄</Text>
      )}

      {/* Render each card; the last one in the array sits on top */}
      {deck.map((shoe, index) => {
        const isTop = index === deck.length - 1;
        return (
          <SwipeCard
            key={shoe.id}
            shoe={shoe}
            isTop={isTop}
            onSwipe={handleSwipe}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#555',
  },
});
