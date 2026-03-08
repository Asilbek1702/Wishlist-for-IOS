import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { logout, getToken } from '../../lib/auth';
import { api } from '../../lib/api';

type User = {
  id: string;
  name?: string;
  email: string;
  image?: string;
};

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const { data } = await api.get('/api/auth/me');
      setUser(data);
    } catch (e) {
      // игнорируем
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Выход', 'Вы уверены?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Выйти', style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Профиль</Text>
      </View>
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color="#6366F1" />
        ) : (
          <>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name ? user.name[0].toUpperCase() : '👤'}
              </Text>
            </View>
            {user?.name ? (
              <Text style={styles.name}>{user.name}</Text>
            ) : null}
            {user?.email ? (
              <Text style={styles.email}>{user.email}</Text>
            ) : null}
          </>
        )}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Выйти из аккаунта</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  title: { fontSize: 24, color: '#111827', fontFamily: 'PlayfairDisplay_600SemiBold' },
  content: { flex: 1, alignItems: 'center', paddingTop: 40 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  avatarText: { fontSize: 36, color: '#6366F1', fontFamily: 'Inter_600SemiBold' },
  name: { fontSize: 20, fontFamily: 'Inter_600SemiBold', color: '#111827', marginBottom: 4 },
  email: { fontSize: 14, color: '#6B7280', marginBottom: 32 },
  logoutButton: { backgroundColor: '#FEE2E2', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12, marginTop: 16 },
  logoutText: { color: '#EF4444', fontFamily: 'Inter_600SemiBold', fontSize: 16 },
});