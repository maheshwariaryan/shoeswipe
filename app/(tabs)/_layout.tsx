// app/(tabs)/_layout.tsx
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useStore } from '../../lib/store';  // two dots: app/(tabs) → ..

export default function TabLayout() {
  const likedCount = useStore(s => s.liked.length);
  const cartCount  = useStore(s => s.cart.length);

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"          // 🏠 Home deck
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="th-large" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="liked"          // ❤️ Liked
        options={{
          title: 'Liked',
          tabBarBadge: likedCount || undefined,
          tabBarIcon: ({ color }) => (
            <FontAwesome name="heart" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"           // 🛒 Cart
        options={{
          title: 'Cart',
          tabBarBadge: cartCount || undefined,
          tabBarIcon: ({ color }) => (
            <FontAwesome name="shopping-cart" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"       // Settings
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="cog" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}