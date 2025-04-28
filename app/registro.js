// frontend/OrcamentoApp/app/registro.js
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function RegistroScreen() {
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const navigation = useNavigation();

  const handleRegistro = async () => {
    try {
      const response = await fetch('http://192.168.0.10:3000/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, senha }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Sucesso', 'Usuário registrado! Faça login.');
        navigation.navigate('login');
      } else {
        Alert.alert('Erro', data.erro || 'Falha no registro');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor');
    }
  };

  return (
    <View className="flex-1 justify-center p-4 bg-gray-100">
      <Text className="text-2xl font-bold mb-6 text-center">Novo Registro</Text>
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
        className="bg-green-500 p-4 rounded-lg items-center"
        onPress={handleRegistro}
      >
        <Text className="text-white text-lg font-semibold">Registrar</Text>
      </TouchableOpacity>
    </View>
  );
}