import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, router } from 'expo-router';
import { useStore } from '../lib/store';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const { width: W, height: H } = Dimensions.get('window');

export default function ShoeDetailModal() {
  const params = useLocalSearchParams();
  const { swipe, preferredSize } = useStore();
  
  // Parse the shoe data from URL params
  const shoe = {
    id: params.id as string,
    brand: params.brand as string,
    model: params.model as string,
    price: parseInt(params.price as string),
    image: parseInt(params.image as string),
  };

  const handleAction = (action: 'like' | 'cart' | 'dismiss') => {
    if (action === 'like') {
      swipe(shoe, 'right');
    } else if (action === 'cart') {
      swipe(shoe, 'up');
    }
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header with close button */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <FontAwesome name="times" size={24} color="#fff" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Main shoe image */}
        <View style={styles.imageContainer}>
          <Image source={shoe.image} style={styles.image} resizeMode="cover" />
        </View>

        {/* Shoe details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.brand}>{shoe.brand}</Text>
          <Text style={styles.model}>{shoe.model}</Text>
          <Text style={styles.price}>${shoe.price}</Text>
          
          <Text style={styles.description}>
            Experience premium comfort and style with these exceptional shoes. 
            Crafted with attention to detail and designed for the modern lifestyle.
          </Text>

          {/* Size info */}
          <View style={styles.sizeContainer}>
            <Text style={styles.sizeTitle}>Size</Text>
            {preferredSize ? (
              <Text style={styles.sizeInfo}>
                Will be added as size {preferredSize} (your preference)
              </Text>
            ) : (
              <Text style={styles.sizeHint}>
                💡 Set your size preference in Settings for seamless shopping
              </Text>
            )}
          </View>

          {/* Action buttons */}
          <View style={styles.actionButtons}>
            <Pressable 
              style={[styles.actionBtn, styles.likeBtn]} 
              onPress={() => handleAction('like')}
            >
              <FontAwesome name="heart" size={20} color="#fff" />
              <Text style={styles.actionBtnText}>Like</Text>
            </Pressable>

            <Pressable 
              style={[styles.actionBtn, styles.cartBtn]} 
              onPress={() => handleAction('cart')}
            >
              <FontAwesome name="shopping-cart" size={20} color="#fff" />
              <Text style={styles.actionBtnText}>Add to Cart</Text>
            </Pressable>
          </View>

          <Pressable 
            style={styles.dismissBtn} 
            onPress={() => handleAction('dismiss')}
          >
            <Text style={styles.dismissText}>Not Interested</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexGrow: 1,
  },
  imageContainer: {
    height: H * 0.5,
    backgroundColor: '#f8f8f8',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    padding: 24,
  },
  brand: {
    fontSize: 16,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  model: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: '600',
    color: '#007aff',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 24,
  },
  sizeContainer: {
    marginBottom: 32,
  },
  sizeTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  sizeInfo: {
    fontSize: 14,
    color: '#007aff',
    marginTop: 4,
    fontWeight: '500',
  },
  sizeHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  likeBtn: {
    backgroundColor: '#ff6b6b',
  },
  cartBtn: {
    backgroundColor: '#007aff',
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dismissBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  dismissText: {
    fontSize: 16,
    color: '#999',
  },
}); 