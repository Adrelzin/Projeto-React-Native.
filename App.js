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
      <FontAwesome name="user-circle" size={80} color="#3b82f6" />

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
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Logar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#10b981' }]}
        onPress={() => navigation.navigate('Cadastro')}
      >
        <Text style={styles.buttonText}>Cadastre-se</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

function Cadastro({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput style={styles.input} placeholder="Seu nome" />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} placeholder="Seu email" />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Sua senha"
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function Contatos() {
  const users = [
    {
      name: 'Marcos Andrade',
      phone: '81 98855-3424',
    },
    {
      name: 'Patrícia Tavares',
      phone: '81 99876-5332',
    },
    {
      name: 'Rodrigo Antunes',
      phone: '81 98776-5525',
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Lista de Contatos</Text>
        <FontAwesome name="plus" size={20} color="#fff" />
      </View>

      <ScrollView>
        {users.map((user, index) => (
          <View key={index} style={styles.contactCard}>
            <View style={styles.contactRow}>
              <View style={styles.avatar}>
                <FontAwesome name="user" size={20} color="#fff" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.contactName}>{user.name}</Text>
                <Text style={styles.contactPhone}>{user.phone}</Text>
              </View>

              <FontAwesome name="chevron-right" size={18} color="#6b7280" />
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Cadastro" component={Cadastro} />
          <Stack.Screen
            name="Home"
            component={Contatos}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
  },

  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    backgroundColor: '#292626',
    color: '#fff',
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
    backgroundColor: '#3b82f6',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },

  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  contactCard: {
    backgroundColor: '#f9fafb',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },

  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },

  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  contactPhone: {
    color: '#6b7280',
  },
});
