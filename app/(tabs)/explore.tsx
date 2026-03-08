import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, ActivityIndicator, TextInput
} from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../lib/api';

type Wishlist = {
  id: string;
  title: string;
  description?: string;
  coverColor: string;
  items: any[];
  owner: { name?: string; email: string };
};

export default function ExploreScreen() {
  const router = useRouter();
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadPublic();
  }, []);

  const loadPublic = async () => {
    try {
      const { data } = await api.get('/api/wishlists/public');
      setWishlists(data);
    } catch (e) {
      // тихая ошибка
    } finally {
      setLoading(false);
    }
  };

  const filtered = wishlists.filter(w =>
    w.title.toLowerCase().includes(search.toLowerCase()) ||
    (w.owner?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Обзор</Text>
        <Text style={styles.subtitle}>Публичные вишлисты</Text>
        <TextInput
          style={styles.search}
          placeholder="Поиск по названию или автору..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyText}>Ничего не найдено</Text>
            </View>
          ) : (
            filtered.map((w) => (
              <TouchableOpacity
                key={w.id}
                style={[styles.card, { borderLeftColor: w.coverColor }]}
                onPress={() => router.push(`/wishlist/${w.id}`)}>
                <View style={[styles.cardIcon, { backgroundColor: w.coverColor + '20' }]}>
                  <Text style={styles.cardEmoji}>🎁</Text>
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{w.title}</Text>
                  {w.description ? (
                    <Text style={styles.cardDesc}>{w.description}</Text>
                  ) : null}
                  <Text style={styles.cardAuthor}>
                    👤 {w.owner?.name || w.owner?.email}
                  </Text>
                  <Text style={styles.cardCount}>{w.items.length} товаров</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  title: { fontSize: 24, color: '#111827', fontFamily: 'PlayfairDisplay_600SemiBold' },
  subtitle: { fontSize: 14, color: '#9CA3AF', marginTop: 4, marginBottom: 12 },
  search: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 10, fontSize: 14, color: '#111827' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20 },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyText: { fontSize: 16, color: '#9CA3AF' },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderLeftWidth: 4, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
  cardIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardEmoji: { fontSize: 24 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#111827', marginBottom: 2 },
  cardDesc: { fontSize: 13, color: '#6B7280', marginBottom: 4 },
  cardAuthor: { fontSize: 12, color: '#6366F1', marginBottom: 2 },
  cardCount: { fontSize: 12, color: '#9CA3AF' },
});