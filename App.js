import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert,
  SafeAreaView, StyleSheet, ActivityIndicator, ScrollView,
  Image,
  SafeAreaViewBase
} from 'react-native';
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

          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </View>
  );

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  return(
    <SafeAreaView>
      <View>
        <Text>CONHEÇA O MUNDO</Text>
        <Text>Explore. Descubra. Viaje.</Text>
        <TextInput placeholder='Email' value={email} onChangeText={setEmail} autoCapitalize='none'></TextInput>
        <TextInput placeholder='Senha' value={senha} onChangeText={setSenha} autoCapitalize='none' secureTextEntry></TextInput>
        <TouchableOpacity style={styles.button} onPress={login}><Text style={styles.buttonText}>Entrar</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.replace('Cadastro')}><Text style={styles.linkText}>Ainda não tem uma conta? Cadastre-se</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function Cadastro(){
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const cadastrar = () => {
    if (!email || !senha) {
    return Alert.alert('Erro', 'Preencha todos os campos!');
  }

  if (senha.length < 6) {
    return setErro('A senha deve ter pelo menos 6 caracteres.');
  }

  createUserWithEmailAndPassword(auth, email, senha)
    .then(() => {
      Alert.alert('Sucesso', 'Conta criada!');
      navigation.replace('TelaPrincipal');
    })
    .catch((error) => {
      console.log(error);
      setErro(error.message);
    });
};

  return(
    <SafeAreaView>
      <View>
        <Text>Criar Conta</Text>
        <Text>Preencha os dados para se cadastrar.</Text>
        <TextInput placeholder='Email' value={email} onChangeText={setEmail} autoCapitalize='none'></TextInput>
        <TextInput placeholder='Senha' value={senha} onChangeText={setSenha} autoCapitalize='none' secureTextEntry></TextInput>
        <TextInput placeholder='Senha' value={senha} onChangeText={setSenha} autoCapitalize='none' secureTextEntry></TextInput>
        <TextInput placeholder='Senha' value={senha} onChangeText={setSenha} autoCapitalize='none' secureTextEntry></TextInput>
        <TouchableOpacity style={styles.button} onPress={login}><Text style={styles.buttonText}>Entrar</Text></TouchableOpacity>
        </View>
    </SafeAreaView>
  );
}

function TelaPrincipal(){

}

function Detalhes(){

}

function Perfil(){

}

function Favoritos(){

}

function AlterarFoto(){
const [foto, setFoto] = 0;

  return(
    <SafeAreaView>
      <View>
        <Image value="foto"></Image>
        <Text>Escolha uma imagem</Text>
        <Text>Sua foto será enviada para o Cloudinary</Text>
        <TouchableOpacity>Escolher da Galeria</TouchableOpacity>
        <TouchableOpacity>Tirar foto</TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

}
