import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [userData, setUserData] = useState(null);
  const [orcamento, setOrcamento] = useState(null);
  const [renda, setRenda] = useState('');
  const [porcentagens, setPorcentagens] = useState({
    gastos_essenciais: '0.60',
    lazer: '0.20',
    economia: '0.20',
  });
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento

  useEffect(() => {
    const fetchOrcamento = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch('http://192.168.0.10:3000/orcamentos', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setOrcamento(data);
          setUserData({ username: data.username }); // Deduzido do token
        } else {
          setOrcamento(null);
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível conectar ao servidor');
      } finally {
        setLoading(false); // Defina como falso após a resposta
      }
    };
    fetchOrcamento();
  }, []);

  const handleSalvarOrcamento = async () => {
    const rendaNum = parseFloat(renda);
    const porcs = {
      gastos_essenciais: parseFloat(porcentagens.gastos_essenciais),
      lazer: parseFloat(porcentagens.lazer),
      economia: parseFloat(porcentagens.economia),
    };
    if (!rendaNum || rendaNum < 0) {
      Alert.alert('Erro', 'Renda válida é obrigatória');
      return;
    }
    const soma = porcs.gastos_essenciais + porcs.lazer + porcs.economia;
    if (Math.abs(soma - 1) > 0.01) {
      Alert.alert('Erro', 'As porcentagens devem somar 100%');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('token');
      const method = orcamento ? 'PUT' : 'POST';
      const url = orcamento ? `http://192.168.0.10:3000/orcamentos/${orcamento.id}` : 'http://192.168.0.10:3000/orcamentos';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ renda: rendaNum, porcentagens: porcs }),
      });
      const data = await response.json();
      if (response.ok) {
        setOrcamento(data.orcamento);
        Alert.alert('Sucesso', `Orçamento ${method === 'PUT' ? 'atualizado' : 'salvo'}`);
        setEditando(false);
      } else {
        Alert.alert('Erro', data.erro || 'Falha ao salvar orçamento');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor');
    }
  };

  const handleDeletarOrcamento = async () => {
    if (!orcamento) return;
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`http://192.168.0.10:3000/orcamentos/${orcamento.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setOrcamento(null);
        setRenda('');
        setPorcentagens({
          gastos_essenciais: '0.60',
          lazer: '0.20',
          economia: '0.20',
        });
        Alert.alert('Sucesso', 'Orçamento deletado');
      } else {
        Alert.alert('Erro', 'Falha ao deletar orçamento');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor');
    }
  };

  return (
    <View className="flex-1 p-4 bg-gray-100">
      {loading ? (
        // Exibe um indicador de carregamento enquanto os dados não são carregados
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text className="text-2xl font-bold mb-4">
            Bem-vindo, ${userData.username}
          </Text>

          {orcamento && !editando ? (
            <View className="mb-6">
              <Text className="text-lg font-semibold mb-2">Orçamento Atual:</Text>
              <Text>Renda: R${orcamento.renda}</Text>
              <Text>Gastos Essenciais: R${orcamento.gastos_essenciais} ({((orcamento.gastos_essenciais / orcamento.renda) * 100)}%)</Text>
              <Text>Lazer: R${orcamento.lazer} ({((orcamento.lazer / orcamento.renda) * 100)}%)</Text>
              <Text>Economia: R${orcamento.economia} ({((orcamento.economia / orcamento.renda) * 100)}%)</Text>
              <View className="flex-row mt-4">
                <TouchableOpacity
                  className="bg-blue-500 p-3 rounded-lg mr-2 flex-1 items-center"
                  onPress={() => {
                    setRenda(orcamento.renda.toString());
                    setPorcentagens({
                      gastos_essenciais: (orcamento.gastos_essenciais / orcamento.renda).toString(),
                      lazer: (orcamento.lazer / orcamento.renda).toString(),
                      economia: (orcamento.economia / orcamento.renda).toString(),
                    });
                    setEditando(true);
                  }}
                >
                  <Text className="text-white font-semibold">Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-red-500 p-3 rounded-lg flex-1 items-center"
                  onPress={handleDeletarOrcamento}
                >
                  <Text className="text-white font-semibold">Deletar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View className="mb-6">
              <Text className="text-lg font-semibold mb-2">{editando ? 'Editar Orçamento' : 'Novo Orçamento'}</Text>
              <TextInput
                className="border border-gray-300 p-3 mb-2 rounded-lg"
                placeholder="Renda"
                value={renda}
                onChangeText={setRenda}
                keyboardType="numeric"
              />
              <TextInput
                className="border border-gray-300 p-3 mb-2 rounded-lg"
                placeholder="Gastos Essenciais (ex.: 0.60)"
                value={porcentagens.gastos_essenciais}
                onChangeText={(text) => setPorcentagens({ ...porcentagens, gastos_essenciais: text })}
                keyboardType="numeric"
              />
              <TextInput
                className="border border-gray-300 p-3 mb-2 rounded-lg"
                placeholder="Lazer (ex.: 0.20)"
                value={porcentagens.lazer}
                onChangeText={(text) => setPorcentagens({ ...porcentagens, lazer: text })}
                keyboardType="numeric"
              />
              <TextInput
                className="border border-gray-300 p-3 mb-2 rounded-lg"
                placeholder="Economia (ex.: 0.20)"
                value={porcentagens.economia}
                onChangeText={(text) => setPorcentagens({ ...porcentagens, economia: text })}
                keyboardType="numeric"
              />
              <TouchableOpacity
                className="bg-blue-500 p-3 rounded-lg items-center"
                onPress={handleSalvarOrcamento}
              >
                <Text className="text-white font-semibold">{editando ? 'Salvar' : 'Criar'} Orçamento</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
}
