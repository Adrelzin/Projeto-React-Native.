import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FontAwesome } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();

function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <FontAwesome name="user-circle" size={80} color="#fcfdfd" />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Insira o email"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        onChangeText={setSenha}
        value={senha}
        placeholder="Insira a senha"
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, styles.Botao1]}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.Botao2]}
        onPress={() => navigation.navigate('Cadastro')}
      >
        <Text style={styles.buttonText}>Criar Conta</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

function Cadastro({ navigation }) {
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
        <TextInput style={styles.input} />

        <Text style={styles.label}>CPF</Text>
        <TextInput style={styles.input} />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, styles.Botao1]}
        >
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

function Contatos({ navigation }) {
  const users = [
    {
      name: 'Estéfanas Argentina',
      phone: '81 98855-3424',
      email: 'estarg@gmail.com'
    },
    {
      name: 'Adryell Willian',
      phone: '81 99876-5332',
      email: 'adwl@gmail.com'
    },
    {
      name: 'Nilson Cardoso',
      phone: '81 98776-5525',
      email: 'nilcar@gmail.com'
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Lista de Contatos</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CadContato')}>
          <FontAwesome name="plus" size={22} color="#ee86b7" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {users.map((user, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate('AltContato', { contato: user })}
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

function CadContato({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={22} color="#ff8daf" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Contato</Text>

        <View style={{ width: 22 }} />
      </View>

      <View style={styles.container}>
        <Text style={styles.label}>Nome</Text>
        <TextInput style={styles.input} />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} />

        <Text style={styles.label}>Telefone</Text>
        <TextInput style={styles.input} />

        <TouchableOpacity
          style={[styles.button, styles.Botao1]}
        >
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  )
}

function AltContato({ navigation, route }) {
  const { contato } = route.params;

  const [nome, setNome] = useState(contato.name);
  const [email, setEmail] = useState(contato.email || '');
  const [telefone, setTelefone] = useState(contato.phone);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={22} color="#ff8daf" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Contato</Text>

        <View style={{ width: 22 }} />
      </View>

      <View style={styles.container}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          value={telefone}
          onChangeText={setTelefone}
        />

        <TouchableOpacity
          style={[styles.button, styles.Botao1]}
        >
          <Text style={styles.buttonText}>Alterar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.Botao2]}
        >
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen
            name="Login"
            component={Login}
          />
          <Stack.Screen
            name="Cadastro"
            component={Cadastro}
          />
          <Stack.Screen
            name="Home"
            component={Contatos}
          />
          <Stack.Screen
            name="CadContato"
            component={CadContato}
          />
          <Stack.Screen
            name="AltContato"
            component={AltContato}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#ff97bf',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
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
    color: '#fff',
    borderColor: "#fff"
  },

  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    backgroundColor: '#fafafa',
    color: '#ff97bf',
    width: 400,
  },

  form: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    marginRight: 160,
  },

  imglog: {
    gap: 15,
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
    borderColor: '#ff97bf',
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
    color: '#fff'
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
  botaoVoltar: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  label: {
    color: '#fff',
  }
});
