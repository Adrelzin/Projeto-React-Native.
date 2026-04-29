import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StyleSheet,
  SafeAreaViewBase,
  ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const firebaseConfig = {
  apiKey: "AIzaSyC5BVI93vIkRtAXerR31YTE9ek3BzU-4e8",
  authDomain: "aula6-atividade-prog3.firebaseapp.com",
  projectId: "aula6-atividade-prog3",
  storageBucket: "aula6-atividade-prog3.firebasestorage.app",
  messagingSenderId: "466202203055",
  appId: "1:466202203055:web:6a5aa9759cc9429eeb955a"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="TelaPrincipal" component={TelaPrincipal} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Cadastro({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const cadastrar = () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    createUserWithEmailAndPassword(auth, email, senha)
      .then(() => {
        Alert.alert('Sucesso', 'Conta criada!');
        navigation.navigate('TelaPrincipal');
      })
      .catch((error) => {
        Alert.alert('Erro', error.message);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>

        <Text>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} />

        <Text>Senha</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={cadastrar}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}

function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(''); 

  const login = () => {
    setErro(''); 
    if (!email || !senha) {
      setErro('Preencha todos os campos');
      return;
    }

    signInWithEmailAndPassword(auth, email, senha)
      .then(() => {
        navigation.navigate('TelaPrincipal');
      })
      .catch((error) => {
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
          setErro('Email ou senha incorretos');
        } else if (error.code === 'auth/user-not-found') {
          setErro('Usuário não encontrado');
        } else {
          setErro(error.message);
        }
      });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} />

        <Text>Senha</Text>
        <TextInput style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry />

        {erro ? <Text style={{ color: 'red', marginTop: 10 }}>{erro}</Text> : null} 

        <TouchableOpacity style={styles.button} onPress={login}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
          <Text style={{ marginTop: 10, textAlign: 'center' }}>Criar conta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function TelaPrincipal() {
  const [cotacoes, setCotacoes] = useState(null);
  const [atualizadoEm, setAtualizadoEm] = useState('');
  const [carregando, setCarregando] = useState(false);

  const buscarCotacoes = async () => {
    setCarregando(true);
    try {
      const resposta = await fetch('https://economia.awesomeapi.com.br/json/all');
      const dados = await resposta.json();

      setCotacoes({
        usd: parseFloat(dados.USD.bid).toFixed(2), 
        eur: parseFloat(dados.EUR.bid).toFixed(2),
      });

      const agora = new Date();
      setAtualizadoEm(agora.toLocaleString('pt-BR'));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível buscar as cotações');
    } finally {
      setCarregando(false);
    }
  };

  React.useEffect(() => {
    buscarCotacoes();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={styles.containerPrincipal}>
        <Text style={styles.titulo}>Cotação de Moedas</Text>
        <Text style={styles.subtitulo}>Última atualização: {atualizadoEm}</Text>

        {carregando ? (
          <ActivityIndicator size="large" color="#007bff" style={{ marginVertical: 20 }} />
        ) : (
          <View>
            {/* Cartão Dólar */}
            <View style={styles.card}>
              <Text style={styles.moedaNome}>🇺🇸 Dólar Americano (USD)</Text>
              <Text style={styles.valor}>R$ {cotacoes?.usd}</Text>
            </View>

            {/* Cartão Euro */}
            <View style={styles.card}>
              <Text style={styles.moedaNome}>🇪🇺 Euro (EUR)</Text>
              <Text style={styles.valor}>R$ {cotacoes?.eur}</Text>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={buscarCotacoes}>
          <Text style={styles.buttonText}>Atualizar Cotações</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginTop: 5,
    borderRadius: 5
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    marginTop: 20,
    borderRadius: 5
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center'
  },
  containerPrincipal: {
    flex: 1,
    padding: 20,
    alignItems: 'stretch',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,  
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  moedaNome: {
    fontSize: 16,
    color: '#333',
  },
  valor: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007bff',
    marginTop: 5,
  },
  container: {
    flex: 1,
    padding: 20,
    justify: 'center'
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
    borderColor: '#ddd'
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    marginTop: 20,
    borderRadius: 5
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  }
});
