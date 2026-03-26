import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet, Text, View, TextInput,
  ScrollView, TouchableOpacity, Alert
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FontAwesome } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();

function Login({ navigation, usuarios }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <FontAwesome name="user-circle" size={80} color="#fcfdfd" />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Insira o email"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Insira a senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity
        style={[styles.button, styles.Botao1]}
        onPress={() => {
          if (!email || !senha) {
            Alert.alert('Atenção', 'Preencha o email e a senha!');
            return;
          }
          const usuarioEncontrado = usuarios.find(
            (u) => u.email === email && u.senha === senha
          );
          if (usuarioEncontrado) {
            navigation.navigate('Home');
          } else {
            Alert.alert('Erro', 'Email ou senha incorretos!');
          }
        }}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.Botao2]}
        onPress={() => navigation.navigate('Cadastro')}
      >
        <Text style={styles.buttonText}>Criar Conta</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function Cadastro({ navigation, usuarios, setUsuarios }) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={22} color="#ff7ebf" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Cadastro</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.container}>
        <Text style={styles.label}>Nome</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} />

        <Text style={styles.label}>CPF</Text>
        <TextInput style={styles.input} value={cpf} onChangeText={setCpf} />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} />

        <Text style={styles.label}>Senha</Text>
        <TextInput style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry />

        <TouchableOpacity
          style={[styles.button, styles.Botao1]}
          onPress={() => {
            if (!nome || !cpf || !email || !senha) {
              Alert.alert('Erro', 'Preencha todos os campos!');
              return;
            }
            setUsuarios([...usuarios, { nome, cpf, email, senha }]);
            Alert.alert('Sucesso', 'Conta criada com sucesso!');
            navigation.goBack();
          }}
        >
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function Contatos({ navigation, contatos }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Lista de Contatos</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CadContato')}>
          <FontAwesome name="plus" size={22} color="#ee86b7" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {contatos.length === 0 && (
          <Text style={{ textAlign: 'center', marginTop: 30, color: '#aaa' }}>
            Nenhum contato cadastrado.
          </Text>
        )}
        {contatos.map((user, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate('AltContato', { contato: user, index })}
          >
            <View style={styles.contactCard}>
              <View style={styles.contactRow}>
                <View style={styles.avatar}>
                  <FontAwesome name="user" size={20} color="#f790bb" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.contactName}>{user.name}</Text>
                  <Text style={styles.contactPhone}>{user.phone}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function CadContato({ navigation, contatos, setContatos }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={22} color="#ff8daf" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Novo Contato</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.container}>
        <Text style={styles.label}>Nome</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} />

        <Text style={styles.label}>Telefone</Text>
        <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} />

        <TouchableOpacity
          style={[styles.button, styles.Botao1]}
          onPress={() => {
            if (!nome || !telefone) {
              Alert.alert('Erro', 'Nome e telefone são obrigatórios!');
              return;
            }
            setContatos([...contatos, { name: nome, email, phone: telefone }]);
            navigation.goBack();
          }}
        >
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function AltContato({ navigation, route, contatos, setContatos }) {
  const { contato, index } = route.params;

  const [nome, setNome] = useState(contato.name);
  const [email, setEmail] = useState(contato.email);
  const [telefone, setTelefone] = useState(contato.phone);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={22} color="#ff8daf" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Editar Contato</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.container}>
        <Text style={styles.label}>Nome</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} />

        <Text style={styles.label}>Telefone</Text>
        <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} />

        <TouchableOpacity
          style={[styles.button, styles.Botao1]}
          onPress={() => {
            const novos = [...contatos];
            novos[index] = { name: nome, email, phone: telefone };
            setContatos(novos);
            navigation.goBack();
          }}
        >
          <Text style={styles.buttonText}>Alterar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.Botao2]}
          onPress={() => {
            const novos = contatos.filter((_, i) => i !== index);
            setContatos(novos);
            navigation.goBack();
          }}
        >
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  const [contatos, setContatos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login">
            {(props) => <Login {...props} usuarios={usuarios} />}
          </Stack.Screen>

          <Stack.Screen name="Cadastro">
            {(props) => <Cadastro {...props} usuarios={usuarios} setUsuarios={setUsuarios} />}
          </Stack.Screen>

          <Stack.Screen name="Home">
            {(props) => <Contatos {...props} contatos={contatos} />}
          </Stack.Screen>

          <Stack.Screen name="CadContato">
            {(props) => <CadContato {...props} contatos={contatos} setContatos={setContatos} />}
          </Stack.Screen>

          <Stack.Screen name="AltContato">
            {(props) => <AltContato {...props} contatos={contatos} setContatos={setContatos} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff97bf',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
    color: '#fff',
    borderColor: '#fff',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  headerText: {
    color: '#ff97bf',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactCard: {
    backgroundColor: '#ff97bf',
    padding: 15,
    borderBottomWidth: 1,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  contactPhone: {
    color: '#fff',
  },
  button: {
    width: 220,
    height: 45,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  Botao1: {
    backgroundColor: '#ffffff',
  },
  Botao2: {
    backgroundColor: '#fbfcfb',
  },
  buttonText: {
    color: '#ff97bf',
    fontSize: 15,
    fontWeight: '600',
  },
  label: {
    color: '#fff',
  },
});
