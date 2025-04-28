// frontend/OrcamentoApp/app/login.js
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await fetch('https://192.168.0.10:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, senha }),
      });
      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        navigation.navigate('home');
      } else {
        Alert.alert('Erro', data.erro || 'Falha no login');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor');
    }
  };

  return (
    <View className="flex-1 justify-center p-4 bg-gray-100">
      <Text className="text-2xl font-bold mb-6 text-center">Login</Text>
      <TextInput
        className="border border-gray-300 p-3 mb-4 rounded-lg"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        className="border border-gray-300 p-3 mb-4 rounded-lg"
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <TouchableOpacity
        className="bg-blue-500 p-4 rounded-lg items-center"
        onPress={handleLogin}
      >
        <Text className="text-white text-lg font-semibold">Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}