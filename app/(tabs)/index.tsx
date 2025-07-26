// app/(tabs)/index.tsx
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { useStore } from '../../lib/store';
import { SwipeCard } from '../../components/SwipeCard';
import { FilterModal } from '../../components/FilterModal';
import FontAwesome from '@expo/vector-icons/FontAwesome';

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
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Zustand actions and state
  const swipeAction = useStore(state => state.swipe);
  const { filters, preferredSize } = useStore();

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

  // Apply filters to deck (simulate filtering logic)
  const filteredDeck = deck.filter(() => {
    // In a real app, you'd filter based on actual shoe data
    // For now, simulate some filtering to show fewer shoes when filters are active
    const hasActiveFilters = Object.values(filters).some(v => v !== null) || preferredSize;
    return hasActiveFilters ? Math.random() > 0.4 : true;
  });

  return (
    <View style={styles.container}>
      {/* Card Stack */}
      <View style={styles.cardContainer}>
        {filteredDeck.length === 0 && (
          <Text style={styles.emptyText}>
            {Object.values(filters).some(v => v !== null) || preferredSize
              ? 'No shoes match your filters! 👟' 
              : 'You\'ve seen them all! 🔄'
            }
          </Text>
        )}

        {/* Render each card; the last one in the array sits on top */}
        {filteredDeck.map((shoe, index) => {
          const isTop = index === filteredDeck.length - 1;
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

      {/* Floating Filter Button */}
      <Pressable 
        style={styles.filterFloatingButton}
        onPress={() => setFilterModalVisible(true)}
      >
        <FontAwesome name="sliders" size={20} color="#fff" />
      </Pressable>

      {/* Filter Modal */}
      <FilterModal 
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
  },
  filterFloatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007aff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
});
