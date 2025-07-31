import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useStore } from '../lib/store';

type CheckoutStep = 'shipping' | 'review' | 'payment' | 'confirmation';

type ShippingInfo = {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
};

export default function CheckoutScreen() {
  const { cart, completeOrder, clearCart } = useStore();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [isLoading, setIsLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleBack = () => {
    if (currentStep === 'shipping') {
      router.back();
    } else if (currentStep === 'review') {
      setCurrentStep('shipping');
    } else if (currentStep === 'payment') {
      setCurrentStep('review');
    }
  };

  const handleContinue = () => {
    if (currentStep === 'shipping') {
      if (validateShippingInfo()) {
        setCurrentStep('review');
      }
    } else if (currentStep === 'review') {
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      handlePlaceOrder();
    }
  };

  const validateShippingInfo = () => {
    const required = ['email', 'firstName', 'lastName', 'address', 'city', 'state', 'zipCode'];
    for (const field of required) {
      if (!shippingInfo[field as keyof ShippingInfo].trim()) {
        Alert.alert('Error', `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingInfo.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const order = {
      id: `ORDER-${Date.now()}`,
      items: cart,
      subtotal,
      shipping,
      tax,
      total,
      shippingInfo,
      timestamp: new Date().toISOString(),
      status: 'confirmed' as const,
    };

    completeOrder(order);
    setCompletedOrder(order);
    clearCart();
    setCurrentStep('confirmation');
    setIsLoading(false);
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'shipping': return 'Shipping Information';
      case 'review': return 'Review Order';
      case 'payment': return 'Payment';
      case 'confirmation': return 'Order Confirmed!';
    }
  };

  const getStepNumber = () => {
    switch (currentStep) {
      case 'shipping': return '1';
      case 'review': return '2';
      case 'payment': return '3';
      case 'confirmation': return '✓';
    }
  };

  if (cart.length === 0 && currentStep !== 'confirmation') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Pressable style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepNumber}>{getStepNumber()}</Text>
          <Text style={styles.stepTitle}>{getStepTitle()}</Text>
        </View>
        <View style={styles.spacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 'shipping' && (
          <ShippingForm 
            shippingInfo={shippingInfo}
            setShippingInfo={setShippingInfo}
          />
        )}
        
        {currentStep === 'review' && (
          <OrderReview 
            cart={cart}
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
            shippingInfo={shippingInfo}
          />
        )}
        
        {currentStep === 'payment' && (
          <PaymentForm />
        )}
        
        {currentStep === 'confirmation' && completedOrder && (
          <OrderConfirmation 
            total={completedOrder.total}
            onContinueShopping={() => router.push('/(tabs)')}
          />
        )}
      </ScrollView>

      {currentStep !== 'confirmation' && (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
          </View>
          <Pressable 
            style={[styles.continueBtn, isLoading && styles.disabledBtn]}
            onPress={handleContinue}
            disabled={isLoading}
          >
            <Text style={styles.continueBtnText}>
              {isLoading 
                ? 'Processing...' 
                : currentStep === 'payment' 
                  ? 'Place Order' 
                  : 'Continue'
              }
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

// Shipping Form Component
function ShippingForm({ 
  shippingInfo, 
  setShippingInfo 
}: { 
  shippingInfo: ShippingInfo;
  setShippingInfo: (info: ShippingInfo) => void;
}) {
  const updateField = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo({ ...shippingInfo, [field]: value });
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Contact Information</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#A8A8A8"
        value={shippingInfo.email}
        onChangeText={(text) => updateField('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#A8A8A8"
        value={shippingInfo.phone}
        onChangeText={(text) => updateField('phone', text)}
        keyboardType="phone-pad"
      />

      <Text style={styles.sectionTitle}>Shipping Address</Text>
      
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="First Name"
          placeholderTextColor="#A8A8A8"
          value={shippingInfo.firstName}
          onChangeText={(text) => updateField('firstName', text)}
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Last Name"
          placeholderTextColor="#A8A8A8"
          value={shippingInfo.lastName}
          onChangeText={(text) => updateField('lastName', text)}
        />
      </View>
      
      <TextInput
        style={styles.input}
        placeholder="Street Address"
        placeholderTextColor="#A8A8A8"
        value={shippingInfo.address}
        onChangeText={(text) => updateField('address', text)}
      />
      
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.flexInput]}
          placeholder="City"
          placeholderTextColor="#A8A8A8"
          value={shippingInfo.city}
          onChangeText={(text) => updateField('city', text)}
        />
        <TextInput
          style={[styles.input, styles.quarterInput]}
          placeholder="State"
          placeholderTextColor="#A8A8A8"
          value={shippingInfo.state}
          onChangeText={(text) => updateField('state', text)}
          maxLength={2}
        />
        <TextInput
          style={[styles.input, styles.quarterInput]}
          placeholder="ZIP"
          placeholderTextColor="#A8A8A8"
          value={shippingInfo.zipCode}
          onChangeText={(text) => updateField('zipCode', text)}
          keyboardType="numeric"
          maxLength={5}
        />
      </View>
    </View>
  );
}

// Order Review Component
function OrderReview({ 
  cart, 
  subtotal, 
  shipping, 
  tax, 
  total, 
  shippingInfo 
}: {
  cart: any[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingInfo: ShippingInfo;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Order Summary</Text>
      
      {cart.map((item) => (
        <View key={item.id} style={styles.orderItem}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.brand} {item.model}</Text>
            {item.selectedSize && (
              <Text style={styles.itemSize}>Size: {item.selectedSize}</Text>
            )}
          </View>
          <Text style={styles.itemPrice}>${item.price}</Text>
        </View>
      ))}

      <View style={styles.divider} />
      
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Subtotal:</Text>
        <Text style={styles.priceValue}>${subtotal.toFixed(2)}</Text>
      </View>
      
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Shipping:</Text>
        <Text style={styles.priceValue}>
          {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
        </Text>
      </View>
      
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Tax:</Text>
        <Text style={styles.priceValue}>${tax.toFixed(2)}</Text>
      </View>

      <Text style={styles.sectionTitle}>Shipping To:</Text>
      <Text style={styles.addressText}>
        {shippingInfo.firstName} {shippingInfo.lastName}{'\n'}
        {shippingInfo.address}{'\n'}
        {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
      </Text>
    </View>
  );
}

// Payment Form Component
function PaymentForm() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Payment Method</Text>
      <Text style={styles.mockText}>
        🎭 This is a demo app - no real payment will be processed
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="Card Number (Demo: 4242 4242 4242 4242)"
        keyboardType="numeric"
      />
      
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="MM/YY"
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="CVC"
          keyboardType="numeric"
        />
      </View>
      
      <TextInput
        style={styles.input}
        placeholder="Cardholder Name"
      />
    </View>
  );
}

// Order Confirmation Component
function OrderConfirmation({ 
  total, 
  onContinueShopping 
}: { 
  total: number;
  onContinueShopping: () => void;
}) {
  return (
    <View style={styles.confirmationContainer}>
      <Text style={styles.confirmationIcon}>🎉</Text>
      <Text style={styles.confirmationTitle}>Order Placed Successfully!</Text>
      <Text style={styles.confirmationMessage}>
        Thank you for your purchase of ${total.toFixed(2)}
      </Text>
      <Text style={styles.confirmationSubtext}>
        You'll receive a confirmation email shortly with tracking information.
      </Text>
      
      <Pressable style={styles.continueShoppingBtn} onPress={onContinueShopping}>
        <Text style={styles.continueShoppingText}>Continue Shopping</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  backBtn: {
    padding: 8,
  },
  backText: {
    fontSize: 16,
    color: '#',
  },
  stepIndicator: {
    flex: 1,
    alignItems: 'center',
  },
  stepNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007aff',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  spacer: {
    width: 60,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  flexInput: {
    flex: 2,
  },
  quarterInput: {
    flex: 1,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemSize: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: '#666',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  addressText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
  },
  mockText: {
    fontSize: 14,
    color: '#ff9500',
    backgroundColor: '#fff3e6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e0e0e0',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007aff',
  },
  continueBtn: {
    backgroundColor: '#007aff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: '#ccc',
  },
  continueBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  confirmationContainer: {
    alignItems: 'center',
    padding: 32,
  },
  confirmationIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  confirmationMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  confirmationSubtext: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 32,
  },
  continueShoppingBtn: {
    backgroundColor: '#007aff',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  continueShoppingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007aff',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});