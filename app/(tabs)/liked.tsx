import {
    View,
    FlatList,
    Text,
    StyleSheet,
    Pressable,
    Image,
  } from 'react-native';
  import { useStore } from '../../lib/store';
  
  export default function LikedScreen() {
    const { liked, moveToCart, removeLiked } = useStore();
  
    if (liked.length === 0)
      return (
        <View style={styles.center}>
          <Text style={styles.empty}>No likes yet. Swipe right to add!</Text>
        </View>
      );
  
    return (
      <FlatList
        contentContainerStyle={styles.list}
        data={liked}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Image source={item.image} style={styles.img} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.brand} {item.model}</Text>
              <Text style={styles.price}>${item.price}</Text>
              <View style={styles.btnRow}>
                <Pressable onPress={() => moveToCart(item.id)}>
                  <Text style={styles.btn}>Add to Cart</Text>
                </Pressable>
                <Pressable onPress={() => removeLiked(item.id)}>
                  <Text style={styles.btnAlt}>Remove</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />
    );
  }
  
  const styles = StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    empty: { fontSize: 16, color: '#666' },
    list: { padding: 16 },
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
    btnRow: { flexDirection: 'row', gap: 12 },
    btn: { color: '#007aff' },
    btnAlt: { color: '#ff3b30' },
  });
  