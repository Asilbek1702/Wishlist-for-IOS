import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Alert, ActivityIndicator,
  Modal, TextInput
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../lib/api';

type Item = {
  id: string;
  title: string;
  description?: string;
  price?: number;
  currency: string;
  status: string;
  priority: number;
};

type Wishlist = {
  id: string;
  title: string;
  description?: string;
  coverColor: string;
  items: Item[];
};

export default function WishlistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemTitle, setItemTitle] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadWishlist();
  }, [id]);

  const loadWishlist = async () => {
    try {
      const { data } = await api.get(`/api/wishlists/${id}`);
      setWishlist(data);
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось загрузить вишлист');
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    if (!itemTitle.trim()) {
      Alert.alert('Ошибка', 'Введите название');
      return;
    }
    setCreating(true);
    try {
      const { data } = await api.post(`/api/wishlists/${id}/items`, {
        title: itemTitle.trim(),
        description: itemDesc.trim() || undefined,
        price: itemPrice ? parseFloat(itemPrice) : undefined,
        currency: 'RUB',
        priority: 1,
      });
      setWishlist(prev => prev ? {
        ...prev,
        items: [...prev.items, data]
      } : prev);
      setModalVisible(false);
      setItemTitle('');
      setItemPrice('');
      setItemDesc('');
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось добавить товар');
    } finally {
      setCreating(false);
    }
  };

  const deleteItem = async (itemId: string) => {
    Alert.alert('Удалить?', 'Товар будет удалён', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить', style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/api/wishlists/${id}/items/${itemId}`);
            setWishlist(prev => prev ? {
              ...prev,
              items: prev.items.filter(i => i.id !== itemId)
            } : prev);
          } catch (e) {
            Alert.alert('Ошибка', 'Не удалось удалить товар');
          }
        }
      }
    ]);
  };

  const reserveItem = async (itemId: string) => {
    Alert.alert('Забронировать?', 'Вы хотите забронировать этот товар?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Забронировать',
        onPress: async () => {
          try {
            await api.post(`/api/wishlists/${id}/items/${itemId}/reserve`, {});
            setWishlist(prev => prev ? {
              ...prev,
              items: prev.items.map(i => i.id === itemId ? { ...i, status: 'RESERVED' } : i)
            } : prev);
          } catch (e) {
            Alert.alert('Ошибка', 'Не удалось забронировать');
          }
        }
      }
    ]);
  };

  const deleteWishlist = async () => {
    Alert.alert('Удалить вишлист?', `"${wishlist?.title}" будет удалён навсегда`, [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить', style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/api/wishlists/${id}`);
            router.back();
          } catch (e) {
            Alert.alert('Ошибка', 'Не удалось удалить вишлист');
          }
        }
      }
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  if (!wishlist) return null;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { borderBottomColor: wishlist.coverColor }]}>
      <View style={styles.headerTop}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Назад</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={deleteWishlist} style={styles.deleteWishlistButton}>
          <Text style={styles.deleteWishlistText}>🗑️ Удалить</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>{wishlist.title}</Text>
        {wishlist.description ? (
          <Text style={styles.desc}>{wishlist.description}</Text>
        ) : null}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {wishlist.items.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🛍️</Text>
            <Text style={styles.emptyTitle}>Список пустой</Text>
            <Text style={styles.emptyText}>Добавь первый товар в вишлист</Text>
          </View>
        ) : (
          wishlist.items.map((item) => (
            <View key={item.id} style={styles.item}>
              <View style={styles.itemLeft}>
                <View style={[styles.priorityDot, {
                  backgroundColor: item.priority === 3 ? '#EF4444' : item.priority === 2 ? '#F59E0B' : '#10B981'
                }]} />
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  {item.description ? (
                    <Text style={styles.itemDesc}>{item.description}</Text>
                  ) : null}
                  {item.price ? (
                    <Text style={styles.itemPrice}>
                      {item.price.toLocaleString()} {item.currency}
                    </Text>
                  ) : null}
                </View>
              </View>
              <View style={styles.itemRight}>
                <View style={[styles.statusBadge, {
                  backgroundColor: item.status === 'RESERVED' ? '#FEE2E2' : '#D1FAE5'
                }]}>
                  <Text style={[styles.statusText, {
                    color: item.status === 'RESERVED' ? '#EF4444' : '#10B981'
                  }]}>
                    {item.status === 'RESERVED' ? 'Забронирован' : 'Свободен'}
                  </Text>
                </View>
                {item.status === 'AVAILABLE' && (
                  <TouchableOpacity onPress={() => reserveItem(item.id)} style={styles.reserveButton}>
                    <Text style={styles.reserveText}>🔒</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => deleteItem(item.id)} style={styles.deleteButton}>
                  <Text style={styles.deleteText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+ Добавить товар</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Новый товар</Text>

            <Text style={styles.label}>Название *</Text>
            <TextInput
              style={styles.input}
              placeholder="Название товара"
              value={itemTitle}
              onChangeText={setItemTitle}
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>Цена (необязательно)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={itemPrice}
              onChangeText={setItemPrice}
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>Описание (необязательно)</Text>
            <TextInput
              style={[styles.input, styles.inputMulti]}
              placeholder="Описание или ссылка"
              value={itemDesc}
              onChangeText={setItemDesc}
              multiline
              placeholderTextColor="#9CA3AF"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={addItem} disabled={creating}>
                {creating ? <ActivityIndicator color="#FFF" size="small" /> : <Text style={styles.saveText}>Добавить</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16, backgroundColor: '#FFF', borderBottomWidth: 3 },
  backButton: { marginBottom: 8 },
  backText: { fontSize: 14, color: '#6366F1', fontFamily: 'Inter_600SemiBold' },
  title: { fontSize: 24, color: '#111827', fontFamily: 'PlayfairDisplay_600SemiBold' },
  desc: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontFamily: 'Inter_600SemiBold', color: '#111827', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#6B7280' },
  item: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
  itemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  priorityDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  itemContent: { flex: 1 },
  itemTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#111827', marginBottom: 2 },
  itemDesc: { fontSize: 13, color: '#6B7280', marginBottom: 2 },
  itemPrice: { fontSize: 13, color: '#6366F1', fontFamily: 'Inter_600SemiBold' },
  itemRight: { alignItems: 'flex-end', gap: 8 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  deleteButton: { padding: 4 },
  deleteText: { fontSize: 16 },
  fab: { position: 'absolute', bottom: 24, left: 20, right: 20, backgroundColor: '#6366F1', padding: 16, borderRadius: 16, alignItems: 'center' },
  fabText: { color: '#FFF', fontFamily: 'Inter_600SemiBold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalTitle: { fontSize: 20, fontFamily: 'Inter_600SemiBold', color: '#111827', marginBottom: 20 },
  label: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#374151', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 12, fontSize: 15, color: '#111827', marginBottom: 16 },
  inputMulti: { height: 80, textAlignVertical: 'top' },
  modalButtons: { flexDirection: 'row', gap: 12 },
  cancelButton: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center' },
  cancelText: { fontFamily: 'Inter_600SemiBold', color: '#6B7280' },
  saveButton: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: '#6366F1', alignItems: 'center' },
  saveText: { fontFamily: 'Inter_600SemiBold', color: '#FFF' },
  reserveButton: { padding: 4 },
  reserveText: { fontSize: 16 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  deleteWishlistButton: { padding: 6 },
  deleteWishlistText: { fontSize: 13, color: '#EF4444', fontFamily: 'Inter_600SemiBold' },
});