import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TextInput, Alert, Button } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {

  const [tela, setTela] = React.useState('login');
  const [email, setEmail] = React.useState('');
  const [senha, setSenha] = React.useState('');

  function handleLogin() {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    Alert.alert('Sucesso', `Email: ${email}`);
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>

        {/* 🔹 TELA LOGIN */}
        {tela === 'login' && (
          <>
            <Image
              style={styles.tinyLogo}
              source={{ uri: 'https://img.icons8.com/?size=100&id=82751&format=png&color=000000' }}
            />

            <Text>Email</Text>
            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              value={email}
              placeholder='Insira o email'
            />

            <Text>Senha</Text>
            <TextInput
              style={styles.input}
              onChangeText={setSenha}
              value={senha}
              placeholder="Insira a senha"
              secureTextEntry={true}
            />

            <Button
              title="Logar"
              color='#31a00fe7'
              onPress={handleLogin}
            />

            <Button
              title="Cadastre-se"
              color='#31a00fe7'
              onPress={() => setTela('cadastro')}
            />

            <Text
              style={{ marginTop: 10, color: 'blue' }}
              onPress={() => setTela('recuperar')}
            >
              Esqueceu a senha?
            </Text>
          </>
        )}

        {/* 🔹 TELA CADASTRO */}
        {tela === 'cadastro' && (
          <>
            <Text style={styles.titulo}>Tela de Cadastro</Text>

            <Button
              title="Voltar"
              onPress={() => setTela('login')}
            />
          </>
        )}

        {/* 🔹 TELA RECUPERAR SENHA */}
        {tela === 'recuperar' && (
          <>
            <Text style={styles.titulo}>Recuperação de Senha</Text>

            <Button
              title="Voltar"
              onPress={() => setTela('login')}
            />
          </>
        )}

        <StatusBar style="auto" />

      </SafeAreaView>
    </SafeAreaProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
