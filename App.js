import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
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
    <View style={styles.webContainer}>
      <View style={styles.appWrapper}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Cadastro" component={Cadastro} />
            <Stack.Screen name="TelaPrincipal" component={TelaPrincipal} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </View>
  );
}

// ===== CADASTRO =====
function Cadastro({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const cadastrar = () => {
    setErro('');

    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    createUserWithEmailAndPassword(auth, email, senha)
      .then(() => {
        Alert.alert('Sucesso', 'Conta criada!');
        navigation.replace('TelaPrincipal');
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
        setErro('Email já está em uso');
      } else if (error.code === 'auth/invalid-email') {
        setErro('Email inválido');

         } else {
        setErro('Erro ao cadastrar');
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

        <TouchableOpacity style={styles.button} onPress={cadastrar}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        {erro ? <Text style={{ color: 'red', marginTop: 10 }}>{erro}</Text> : null}

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
        navigation.replace('TelaPrincipal');
      })
      .catch((error) => {
        setErro("Email ou senha errada");
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
        usd: parseFloat(dados.USDBRL.bid).toFixed(2),
        eur: parseFloat(dados.EURBRL.bid).toFixed(2),
      });

      setAtualizadoEm(new Date().toLocaleString('pt-BR'));
    } catch {
      Alert.alert('Erro', 'Falha ao buscar cotações');
    } finally {
      setCarregando(false);
    }
  };

  React.useEffect(() => {
    buscarCotacoes();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#eef2f5' }}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cotação de Moedas</Text>
      </View>

      <View style={{ padding: 20 }}>
        <View style={styles.subHeader}>
          <Text style={styles.subHeaderTitle}>Cotação Atual</Text>
          <Text style={styles.subHeaderText}>
            Última atualização: {atualizadoEm}
          </Text>
        </View>

        {carregando ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.moeda}>🇺🇸 Dólar Americano (USD)</Text>
              <Text style={styles.valor}>R$ {cotacoes ? cotacoes.usd : '--'}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.moeda}>🇪🇺 Euro (EUR)</Text>
              <Text style={styles.valor}>R$ {cotacoes ? cotacoes.eur : '--'}</Text>
            </View>
          </>
        )}

        <TouchableOpacity
          style={styles.botao}
          onPress={buscarCotacoes}
          disabled={carregando}
        >
          <Text style={styles.botaoTexto}>
            {carregando ? 'Atualizando...' : 'Atualizar Cotações'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ===== ESTILOS =====
const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ccc',
  },

  appWrapper: {
    width: '100%',
    maxWidth: 420,
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
  },

  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },

  input: {
    borderWidth: 1,
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
    borderColor: '#ddd',
  },

  button: {
    backgroundColor: '#007bff',
    padding: 15,
    marginTop: 20,
    borderRadius: 5,
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  header: {
    backgroundColor: '#2f3c7e',
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  subHeader: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 2,
  },

  subHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  subHeaderText: {
    fontSize: 12,
    color: '#666',
  },

  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
  },

  moeda: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  valor: {
    fontSize: 20,
    color: '#2f3c7e',
    fontWeight: 'bold',
  },

  botao: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 30,
    marginTop: 20,
    alignItems: 'center',
  },

  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
