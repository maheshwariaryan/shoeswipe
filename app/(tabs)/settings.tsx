import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../lib/store';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function SettingsScreen() {
  const { preferredSize, setPreferredSize, orders } = useStore();
  const [showOrders, setShowOrders] = useState(false);

  const handleSizeSelect = (size: number | null) => {
    setPreferredSize(size);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
      <View style={styles.header}>
        <Text style={styles.title}>⚙️ Settings</Text>
        <Text style={styles.subtitle}>Customize your shopping experience</Text>
      </View>

      {/* Size Preference Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👟 Size Preference</Text>
        <Text style={styles.sectionDescription}>
          Choose your shoe size for seamless shopping. Only shoes available in your size will be shown, and items will be automatically added to your cart in this size.
        </Text>
        
        <View style={styles.sizeGrid}>
          {/* Clear selection option */}
          <Pressable 
            style={[
              styles.sizeOption,
              !preferredSize && styles.sizeOptionSelected
            ]}
            onPress={() => handleSizeSelect(null)}
          >
            <Text style={[
              styles.sizeText,
              !preferredSize && styles.sizeTextSelected
            ]}>
              All
            </Text>
          </Pressable>

          {/* Size options */}
          {[7, 8, 9, 10, 11, 12].map((size) => (
            <Pressable 
              key={size} 
              style={[
                styles.sizeOption,
                preferredSize === size && styles.sizeOptionSelected
              ]}
              onPress={() => handleSizeSelect(size)}
            >
              <Text style={[
                styles.sizeText,
                preferredSize === size && styles.sizeTextSelected
              ]}>
                {size}
              </Text>
            </Pressable>
          ))}
        </View>

        {preferredSize ? (
          <View style={styles.statusContainer}>
            <FontAwesome name="check-circle" size={16} color="#4CAF50" />
            <Text style={styles.statusText}>
              Size {preferredSize} selected - Only showing available shoes
            </Text>
          </View>
        ) : (
          <View style={styles.statusContainer}>
            <FontAwesome name="info-circle" size={16} color="#999" />
            <Text style={styles.statusTextGray}>
              Showing all sizes - Select a size for filtered results
            </Text>
          </View>
        )}
      </View>

      {/* Future sections can go here */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📱 App Info</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Shoes Available</Text>
          <Text style={styles.infoValue}>2 styles</Text>
        </View>
      </View>

      {/* Order History Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📦 Order History</Text>
        <Pressable 
          style={styles.orderHistoryBtn}
          onPress={() => setShowOrders(!showOrders)}
        >
          <Text style={styles.orderHistoryText}>
            View Orders ({orders.length})
          </Text>
          <Text style={styles.chevron}>{showOrders ? '▼' : '▶'}</Text>
        </Pressable>
        
        {showOrders && (
          <View style={styles.ordersContainer}>
            {orders.length === 0 ? (
              <Text style={styles.noOrdersText}>No orders yet</Text>
            ) : (
              orders.map((order) => (
                <View key={order.id} style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <Text style={styles.orderId}>{order.id}</Text>
                    <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
                  </View>
                  <Text style={styles.orderDate}>
                    {new Date(order.timestamp).toLocaleDateString()}
                  </Text>
                  <Text style={styles.orderStatus}>Status: {order.status}</Text>
                  <Text style={styles.orderItems}>
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </Text>
                </View>
              ))
            )}
          </View>
        )}
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e9ecef',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  sizeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  sizeOption: {
    width: 50,
    height: 50,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  sizeOptionSelected: {
    backgroundColor: '#007aff',
    borderColor: '#007aff',
  },
  sizeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sizeTextSelected: {
    color: '#fff',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  statusTextGray: {
    fontSize: 14,
    color: '#999',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#333',
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  orderHistoryBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  orderHistoryText: {
    fontSize: 16,
    color: '#007aff',
  },
  chevron: {
    fontSize: 16,
    color: '#007aff',
  },
  ordersContainer: {
    marginTop: 12,
  },
  noOrdersText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 20,
  },
  orderCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e0e0e0',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007aff',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  orderStatus: {
    fontSize: 14,
    color: '#28a745',
    marginBottom: 2,
  },
  orderItems: {
    fontSize: 14,
    color: '#666',
  },
}); 