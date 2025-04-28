// frontend/OrcamentoApp/app/index.js
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function InitialScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-4">
      <Text className="text-3xl font-bold mb-8">Orçamento Mensal</Text>
      <TouchableOpacity
        className="bg-blue-500 p-4 rounded-lg mb-4 w-full items-center"
        onPress={() => navigation.navigate('login')}
      >
        <Text className="text-white text-lg font-semibold">Fazer Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-green-500 p-4 rounded-lg w-full items-center"
        onPress={() => navigation.navigate('registro')}
      >
        <Text className="text-white text-lg font-semibold">Novo Registro</Text>
      </TouchableOpacity>
    </View>
  );
}