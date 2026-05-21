import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  FlatList
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

function App() {
  return (
    <View style={styles.webContainer}>
      <View style={styles.appWrapper}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Cadastro" component={Cadastro} />
            <Stack.Screen name="TelaPrincipal" component={TelaPrincipal} />
            <Stack.Screen name="Detalhes" component={Detalhes} />
            <Stack.Screen name="Favoritos" component={Favoritos} />
            <Stack.Screen name="Perfil" component={Perfil} />
            <Stack.Screen name="AlterarFoto" component={AlterarFoto} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </View>
  );
}

function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  return (
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

function Cadastro({ navigation }) {
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

  return (
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

function TelaPrincipal({ navigation }) {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadCountries();
  }, []);

  async function loadCountries() {
    const response = await fetch(
      'https://restcountries.com/v3.1/all?fields=name,capital,flags,region,subregion,population,languages,currencies,continents,timezones'
    );

    const data = await response.json();

    data.sort((a, b) =>
      a.name.common.localeCompare(b.name.common)
    );

    setCountries(data);
  }

  function openCountryDetails(country) {
    console.log(country);

    navigation.navigate("Detalhes", { country });
  }

  function renderItem({ item }) {
    return (
      <TouchableOpacity
        onPress={() => openCountryDetails(item)}
        style={styles.card}
      >
        <Image
          source={{ uri: item.flags.png }}
          style={styles.flag}
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.country}>
            {item.name.common}
          </Text>

          <Text style={styles.capital}>
            Capital: {item.capital?.[0]}
          </Text>
        </View>

        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
    );
  }

  const filteredCountries = countries.filter(country =>
    country.name.common
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1 }}>

      <TextInput
        placeholder="Pesquisar país..."
        style={styles.search}
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredCountries}
        renderItem={renderItem}
        keyExtractor={(item) => item.name.common}
      />

      <View style={styles.bottomBar}>

        <TouchableOpacity onPress={() => navigation.navigate('TelaPrincipal')}>
          <Text>🏠 Início</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Favoritos')}
        ><Text>🤍 Favoritos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
          <Text>👤 Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Detalhes({ route }) {
  const { country } = route.params;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>

      <Image
        source={{ uri: country.flags.png }}
        style={{
          width: '100%',
          height: 220,
        }}
      />

      <View style={{ padding: 20 }}>

        <Text
          style={{
            fontSize: 32,
            fontWeight: 'bold',
          }}
        >
          {country.name.common}
        </Text>

        <Text
          style={{
            fontSize: 18,
            color: 'gray',
            marginBottom: 20,
          }}
        >
          {country.name.official}
        </Text>

        <Text style={{ fontSize: 18, marginBottom: 10 }}>
          Capital: {country.capital?.[0]}
        </Text>

        <Text style={{ fontSize: 18, marginBottom: 10 }}>
          População: {country.population}
        </Text>

        <Text style={{ fontSize: 18, marginBottom: 10 }}>
          Região: {country.region}
        </Text>

        <Text style={{ fontSize: 18, marginBottom: 10 }}>
          Sub-região: {country.subregion}
        </Text>

        <Text style={{ fontSize: 18, marginBottom: 10 }}>
          Continente: {country.continents?.[0]}
        </Text>

        <Text style={{ fontSize: 18, marginBottom: 10 }}>
          Idioma: {Object.values(country.languages || {}).join(', ')}
        </Text>

        <Text style={{ fontSize: 18, marginBottom: 10 }}>
          Moeda: {
            Object.values(country.currencies || {})
              .map((c) => c.name)
              .join(', ')
          }
        </Text>

        <Text style={{ fontSize: 18, marginBottom: 20 }}>
          Fuso horário: {country.timezones?.[0]}
        </Text>

        <TouchableOpacity
          style={{
            backgroundColor: '#1565FF',
            padding: 18,
            borderRadius: 12,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontSize: 18,
              fontWeight: 'bold',
            }}
          >
            Adicionar aos Favoritos
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

function Perfil({ navigation }) {

}

function Favoritos({ navigation }) {

}

function AlterarFoto({ navigation }) {
  const [foto, setFoto] = useState(null);

  return (
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

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
  },

  appWrapper: {
    flex: 1,
  },

  button: {
    backgroundColor: '#1565FF',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  linkText: {
    color: 'blue',
    marginTop: 15,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    margin: 8,
    padding: 15,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  flag: {
    width: 55,
    height: 40,
    marginRight: 15,
  },

  country: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  capital: {
    color: 'gray',
  },

  arrow: {
    fontSize: 25,
    color: 'gray',
  },
  search: {
    backgroundColor: '#fff',
    margin: 12,
    padding: 15,
    borderRadius: 12,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
});

export default App;
