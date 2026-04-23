import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StyleSheet
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Cadastro() {
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

  const login = () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    signInWithEmailAndPassword(auth, email, senha)
      .then(() => {
        Alert.alert('Sucesso', 'Logado');
      })
      .catch((error) => {
        Alert.alert('Erro', error.message);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        <Text>Senha</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={login}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
          <Text style={{ marginTop: 10, textAlign: 'center' }}>
            Criar conta
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function TelaPrincipal({ navigation }) {
  const
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
  }
});
