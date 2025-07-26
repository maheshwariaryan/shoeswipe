import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useStore, Filters } from '../lib/store';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const { width: W } = Dimensions.get('window');

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const FilterModal: React.FC<Props> = ({ visible, onClose }) => {
  const { filters, updateFilters, clearFilters, preferredSize } = useStore();
  const [tempFilters, setTempFilters] = useState<Filters>(filters);

  // Sync tempFilters with store when modal opens
  React.useEffect(() => {
    if (visible) {
      setTempFilters({
        ...filters,
        // Default size to preferred size if no explicit size filter is set
        size: filters.size || preferredSize,
      });
    }
  }, [visible, filters, preferredSize]);

  const handleApply = () => {
    updateFilters(tempFilters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: Filters = {
      size: null,
      brand: null,
      color: null,
      category: null,
      priceRange: null,
    };
    setTempFilters(clearedFilters);
  };

  const handleClose = () => {
    setTempFilters(filters); // Reset to current filters
    onClose();
  };

  const updateTempFilter = (key: keyof Filters, value: any) => {
    setTempFilters(prev => ({ ...prev, [key]: value }));
  };

  const sizes = [7, 8, 9, 10, 11, 12];
  const brands = ['All', 'Nike', 'Adidas', 'Jordan', 'Puma', 'Converse', 'Vans'];
  const colors = ['All', 'Black', 'White', 'Brown', 'Red', 'Blue', 'Gray', 'Green'];
  const categories = ['All', 'Sneakers', 'Boots', 'Dress', 'Casual', 'Athletic', 'Sandals'];

  const hasActiveFilters = Object.values(tempFilters).some(v => v !== null);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={handleClose} style={styles.closeButton}>
            <FontAwesome name="times" size={20} color="#666" />
          </Pressable>
          <Text style={styles.title}>🔍 Filters</Text>
          <Pressable onPress={handleClear} style={styles.clearButton}>
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>
        </View>

        {/* Scrollable Content */}
        <ScrollView 
          style={styles.content} 
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Size Filter - Required */}
          <View style={styles.filterSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>👟 Size</Text>
              <Text style={styles.requiredText}>Required</Text>
            </View>
            <Text style={styles.sectionDescription}>
              {preferredSize 
                ? `Your preference: ${preferredSize}. Override below if needed.`
                : 'Select your size to see available shoes'
              }
            </Text>
            <View style={styles.optionGrid}>
              {sizes.map((size) => (
                <Pressable
                  key={size}
                  style={[
                    styles.optionButton,
                    (tempFilters.size === size || (!tempFilters.size && preferredSize === size)) && styles.optionButtonActive
                  ]}
                  onPress={() => updateTempFilter('size', size)}
                >
                  <Text style={[
                    styles.optionText,
                    (tempFilters.size === size || (!tempFilters.size && preferredSize === size)) && styles.optionTextActive
                  ]}>
                    {size}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Brand Filter */}
          <View style={styles.filterSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🏷️ Brand</Text>
            </View>
            <View style={styles.optionGrid}>
              {brands.map((brand) => (
                <Pressable
                  key={brand}
                  style={[
                    styles.optionButton,
                    styles.brandButton,
                    (tempFilters.brand === brand || (brand === 'All' && !tempFilters.brand)) && styles.optionButtonActive
                  ]}
                  onPress={() => updateTempFilter('brand', brand === 'All' ? null : brand)}
                >
                  <Text style={[
                    styles.optionText,
                    (tempFilters.brand === brand || (brand === 'All' && !tempFilters.brand)) && styles.optionTextActive
                  ]}>
                    {brand}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Color Filter */}
          <View style={styles.filterSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🎨 Color</Text>
            </View>
            <View style={styles.optionGrid}>
              {colors.map((color) => (
                <Pressable
                  key={color}
                  style={[
                    styles.optionButton,
                    styles.colorButton,
                    (tempFilters.color === color || (color === 'All' && !tempFilters.color)) && styles.optionButtonActive
                  ]}
                  onPress={() => updateTempFilter('color', color === 'All' ? null : color)}
                >
                  <Text style={[
                    styles.optionText,
                    (tempFilters.color === color || (color === 'All' && !tempFilters.color)) && styles.optionTextActive
                  ]}>
                    {color}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Category Filter */}
          <View style={styles.filterSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>👔 Category</Text>
            </View>
            <View style={styles.optionGrid}>
              {categories.map((category) => (
                <Pressable
                  key={category}
                  style={[
                    styles.optionButton,
                    styles.categoryButton,
                    (tempFilters.category === category || (category === 'All' && !tempFilters.category)) && styles.optionButtonActive
                  ]}
                  onPress={() => updateTempFilter('category', category === 'All' ? null : category)}
                >
                  <Text style={[
                    styles.optionText,
                    (tempFilters.category === category || (category === 'All' && !tempFilters.category)) && styles.optionTextActive
                  ]}>
                    {category}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Price Range Filter */}
          <View style={styles.filterSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>💰 Price Range</Text>
            </View>
            <View style={styles.priceGrid}>
              {[
                { label: 'All', range: null },
                { label: 'Under $50', range: [0, 50] as [number, number] },
                { label: '$50-$100', range: [50, 100] as [number, number] },
                { label: '$100-$200', range: [100, 200] as [number, number] },
                { label: '$200+', range: [200, 1000] as [number, number] },
              ].map((option) => (
                <Pressable
                  key={option.label}
                  style={[
                    styles.priceButton,
                    (JSON.stringify(tempFilters.priceRange) === JSON.stringify(option.range)) && styles.optionButtonActive
                  ]}
                  onPress={() => updateTempFilter('priceRange', option.range)}
                >
                  <Text style={[
                    styles.optionText,
                    (JSON.stringify(tempFilters.priceRange) === JSON.stringify(option.range)) && styles.optionTextActive
                  ]}>
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Apply Button - Always Visible */}
        <View style={styles.footer}>
          <Pressable style={styles.applyButton} onPress={handleApply}>
            <FontAwesome name="check" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.applyButtonText}>
              {hasActiveFilters ? 'Apply Filters' : 'Show All Shoes'}
            </Text>
          </Pressable>
        </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  clearText: {
    fontSize: 16,
    color: '#007aff',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  filterSection: {
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  requiredText: {
    fontSize: 12,
    color: '#ff6b6b',
    fontWeight: '500',
    backgroundColor: '#fff0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#e9ecef',
    backgroundColor: '#fff',
    minWidth: 60,
    alignItems: 'center',
  },
  brandButton: {
    minWidth: 80,
  },
  colorButton: {
    minWidth: 70,
  },
  categoryButton: {
    minWidth: 90,
  },
  optionButtonActive: {
    backgroundColor: '#007aff',
    borderColor: '#007aff',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  optionTextActive: {
    color: '#fff',
  },
  priceGrid: {
    gap: 12,
  },
  priceButton: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  footer: {
    padding: 20,
    paddingBottom: 60, // Much more padding from bottom edge
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  applyButton: {
    backgroundColor: '#007aff',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 