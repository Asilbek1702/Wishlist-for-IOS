import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Alert, ActivityIndicator, Modal, TextInput
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { api } from '../../lib/api';
import { useRouter } from 'expo-router';

type Wishlist = {
  id: string;
  title: string;
  description?: string;
  coverColor: string;
  items: any[];
  eventDate?: string;
};

export default function DashboardScreen() {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const colors = ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];
  const [selectedColor, setSelectedColor] = useState('#6366F1');
  const router = useRouter();

  useEffect(() => {
    loadWishlists();
  }, []);

  const loadWishlists = async () => {
    try {
      const { data } = await api.get('/api/wishlists');
      setWishlists(data);
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось загрузить вишлисты');
    } finally {
      setLoading(false);
    }
  };

  const createWishlist = async () => {
    if (!title.trim()) {
      Alert.alert('Ошибка', 'Введите название');
      return;
    }
    setCreating(true);
    try {
      const { data } = await api.post('/api/wishlists', {
        title: title.trim(),
        description: description.trim() || undefined,
        coverColor: selectedColor,
        isPublic: true,
      });
      setWishlists([data, ...wishlists]);
      setModalVisible(false);
      setTitle('');
      setDescription('');
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось создать вишлист');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Добро пожаловать</Text>
          <Text style={styles.title}>Мои вишлисты</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+ Новый</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {wishlists.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emoji}>🎁</Text>
            </View>
            <Text style={styles.emptyTitle}>Создай первый вишлист</Text>
            <Text style={styles.emptyText}>
              Здесь появятся твои списки подарков для дней рождения, свадеб и других событий.
            </Text>
            <TouchableOpacity style={styles.createButton} onPress={() => setModalVisible(true)}>
              <Text style={styles.createButtonText}>Создать вишлист</Text>
            </TouchableOpacity>
          </View>
        ) : (
          wishlists.map((w) => (
            <TouchableOpacity key={w.id} style={[styles.card, { borderLeftColor: w.coverColor }]} onPress={() => router.push(`/wishlist/${w.id}`)}>
              <View style={[styles.cardIcon, { backgroundColor: w.coverColor + '20' }]}>
                <Text style={styles.cardEmoji}>🎁</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{w.title}</Text>
                {w.description ? (
                  <Text style={styles.cardDesc}>{w.description}</Text>
                ) : null}
                <Text style={styles.cardCount}>{w.items.length} товаров</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Новый вишлист</Text>

            <Text style={styles.label}>Название *</Text>
            <TextInput
              style={styles.input}
              placeholder="День рождения, Свадьба..."
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>Описание</Text>
            <TextInput
              style={[styles.input, styles.inputMulti]}
              placeholder="Необязательно"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>Цвет</Text>
            <View style={styles.colors}>
              {colors.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.colorDot, { backgroundColor: c },
                    selectedColor === c && styles.colorDotSelected]}
                  onPress={() => setSelectedColor(c)}
                />
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={createWishlist}
                disabled={creating}>
                {creating ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={styles.saveText}>Создать</Text>
                )}
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
  header: {
    paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
  },
  welcome: { fontSize: 12, color: '#9CA3AF', marginBottom: 2 },
  title: { fontSize: 24, color: '#111827', fontFamily: 'PlayfairDisplay_600SemiBold' },
  addButton: { backgroundColor: '#6366F1', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  addButtonText: { color: '#FFFFFF', fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  scroll: { flex: 1 },
  scrollContent: { padding: 20 },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyIcon: { width: 120, height: 120, borderRadius: 24, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  emoji: { fontSize: 48 },
  emptyTitle: { fontSize: 20, fontFamily: 'Inter_600SemiBold', color: '#111827', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#6B7280', textAlign: 'center', paddingHorizontal: 20, marginBottom: 32 },
  createButton: { backgroundColor: '#6366F1', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
  createButtonText: { color: '#FFFFFF', fontFamily: 'Inter_600SemiBold', fontSize: 16 },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderLeftWidth: 4, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
  cardIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardEmoji: { fontSize: 24 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#111827', marginBottom: 2 },
  cardDesc: { fontSize: 13, color: '#6B7280', marginBottom: 4 },
  cardCount: { fontSize: 12, color: '#9CA3AF' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalTitle: { fontSize: 20, fontFamily: 'Inter_600SemiBold', color: '#111827', marginBottom: 20 },
  label: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#374151', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 12, fontSize: 15, color: '#111827', marginBottom: 16 },
  inputMulti: { height: 80, textAlignVertical: 'top' },
  colors: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  colorDot: { width: 32, height: 32, borderRadius: 16 },
  colorDotSelected: { borderWidth: 3, borderColor: '#111827' },
  modalButtons: { flexDirection: 'row', gap: 12 },
  cancelButton: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center' },
  cancelText: { fontFamily: 'Inter_600SemiBold', color: '#6B7280' },
  saveButton: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: '#6366F1', alignItems: 'center' },
  saveText: { fontFamily: 'Inter_600SemiBold', color: '#FFF' },
});