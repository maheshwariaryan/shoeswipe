import {
    View,
    FlatList,
    Text,
    StyleSheet,
    Pressable,
    Image,
  } from 'react-native';
  import { useStore } from '../../lib/store';
  
  export default function CartScreen() {
    const { cart, removeCart } = useStore();
    const total = cart.reduce((sum, s) => sum + s.price, 0);
  
    if (cart.length === 0)
      return (
        <View style={styles.center}>
          <Text style={styles.empty}>Your cart is empty. Swipe up to add!</Text>
        </View>
      );
  
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          contentContainerStyle={styles.list}
          data={cart}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Image source={item.image} style={styles.img} />
              <View style={styles.info}>
                <Text style={styles.name}>{item.brand} {item.model}</Text>
                <Text style={styles.price}>${item.price}</Text>
                <Pressable onPress={() => removeCart(item.id)}>
                  <Text style={styles.btnAlt}>Remove</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
  
        <View style={styles.footer}>
          <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
          {/* Checkout button stub */}
          <Pressable style={styles.payBtn}>
            <Text style={styles.payTxt}>Checkout</Text>
          </Pressable>
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    empty: { fontSize: 16, color: '#666' },
    list: { padding: 16, paddingBottom: 120 },
    row: {
      flexDirection: 'row',
      marginBottom: 16,
      backgroundColor: '#fff',
      borderRadius: 12,
      elevation: 3,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    img: { width: 90, height: 120, borderTopLeftRadius: 12, borderBottomLeftRadius: 12 },
    info: { flex: 1, padding: 12, justifyContent: 'space-between' },
    name: { fontSize: 16, fontWeight: '600' },
    price: { fontSize: 14, color: '#888' },
    btnAlt: { color: '#ff3b30' },
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#fff',
      padding: 16,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: '#ddd',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    total: { fontSize: 18, fontWeight: '600' },
    payBtn: {
      backgroundColor: '#007aff',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    payTxt: { color: '#fff', fontWeight: '600' },
  });
  