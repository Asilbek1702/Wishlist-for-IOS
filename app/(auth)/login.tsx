import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { login } from '../../lib/auth';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password.trim());
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Ошибка', 'Неверный email или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>🎁</Text>
        </View>
        <Text style={styles.title}>Добро пожаловать</Text>
        <Text style={styles.subtitle}>Войдите в свой аккаунт</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="your@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>Пароль</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#9CA3AF"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}>
          {loading
            ? <ActivityIndicator color="#FFF" />
            : <Text style={styles.buttonText}>Войти</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.link}
          onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.linkText}>Нет аккаунта? <Text style={styles.linkBold}>Зарегистрироваться</Text></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  logoBox: { width: 80, height: 80, borderRadius: 20, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 24 },
  logoEmoji: { fontSize: 40 },
  title: { fontSize: 28, fontFamily: 'PlayfairDisplay_600SemiBold', color: '#111827', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#6B7280', textAlign: 'center', marginBottom: 32 },
  label: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#374151', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 14, fontSize: 15, color: '#111827', marginBottom: 16, backgroundColor: '#FFF' },
  button: { backgroundColor: '#6366F1', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#FFF', fontFamily: 'Inter_600SemiBold', fontSize: 16 },
  link: { marginTop: 20, alignItems: 'center' },
  linkText: { fontSize: 14, color: '#6B7280' },
  linkBold: { color: '#6366F1', fontFamily: 'Inter_600SemiBold' },
});