import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, StyleSheet, Image, FlatList } from 'react-native';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updatePassword } from "firebase/auth";
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
const db = getFirestore(app);

async function getFavoritos() {
  const uid = auth.currentUser.uid;
  const snap = await getDoc(doc(db, 'favoritos', uid));
  return snap.exists() ? snap.data().lista : [];
}

async function saveFavoritos(lista) {
  const uid = auth.currentUser.uid;
  await setDoc(doc(db, 'favoritos', uid), { lista });
}

function BottomBar({ navigation, favoritos = [] }) {
  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity onPress={() => navigation.navigate('TelaPrincipal')}><Text>🏠 Início</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Favoritos', { favoritos })}><Text>🤍 Favoritos</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Perfil')}><Text>👤 Perfil</Text></TouchableOpacity>
    </View>
  );
}

function App() {
  return (
    <View style={styles.webContainer}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Cadastro" component={Cadastro} />
          <Stack.Screen name="TelaPrincipal" component={TelaPrincipal} />
          <Stack.Screen name="Detalhes" component={Detalhes} />
          <Stack.Screen name="Favoritos" component={Favoritos} />
          <Stack.Screen name="Perfil" component={Perfil} />
          <Stack.Screen name="AlterarFoto" component={AlterarFoto} />
          <Stack.Screen name="AlterarSenha" component={AlterarSenha} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const login = () => {
    if (!email || !senha) return setErro('Preencha todos os campos');
    signInWithEmailAndPassword(auth, email, senha)
      .then(() => navigation.replace('TelaPrincipal'))
      .catch(() => setErro('Email ou senha incorretos'));
  };

  return (
    <SafeAreaView>
      <View>
        <Text>CONHEÇA O MUNDO</Text>
        <Text>Explore. Descubra. Viaje.</Text>
        <TextInput placeholder='Email' value={email} onChangeText={setEmail} autoCapitalize='none' autoComplete="new-password" />
        <TextInput placeholder='Senha' value={senha} onChangeText={setSenha} autoCapitalize='none' secureTextEntry autoComplete="new-password" onSubmitEditing={login} />
        {erro ? <Text style={styles.erro}>{erro}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={login}><Text style={styles.buttonText}>Entrar</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.replace('Cadastro')}><Text style={styles.linkText}>Ainda não tem uma conta? Cadastre-se</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function Cadastro({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confsenha, setConfSenha] = useState('');
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState('');

  const cadastrar = () => {
    if (!email || !senha || !nome) return Alert.alert('Erro', 'Preencha todos os campos!');
    if (senha.length < 6) return setErro('A senha deve ter pelo menos 6 caracteres.');
    if (senha !== confsenha) return setErro('As senhas não coincidem.');
    createUserWithEmailAndPassword(auth, email, senha)
      .then(() => { Alert.alert('Sucesso', 'Conta criada!'); navigation.replace('TelaPrincipal'); })
      .catch((error) => setErro(error.message));
  };

  return (
    <SafeAreaView>
      <View>
        <Text>Criar Conta</Text>
        <Text>Preencha os dados para se cadastrar.</Text>
        <TextInput placeholder='Nome completo' value={nome} onChangeText={setNome} autoCapitalize='words' />
        <TextInput placeholder='Email' value={email} onChangeText={setEmail} autoCapitalize='none' />
        <TextInput placeholder='Senha' value={senha} onChangeText={setSenha} autoCapitalize='none' secureTextEntry />
        <TextInput placeholder='Confirmar Senha' value={confsenha} onChangeText={setConfSenha} autoCapitalize='none' secureTextEntry />
        {erro ? <Text style={styles.erro}>{erro}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={cadastrar}><Text style={styles.buttonText}>Cadastrar</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function TelaPrincipal({ navigation }) {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name,capital,flags,region,subregion,population,languages,currencies,continents,timezones')
      .then(r => r.json())
      .then(data => setCountries(data.sort((a, b) => a.name.common.localeCompare(b.name.common))));
    getFavoritos().then(setFavoritos);
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => getFavoritos().then(setFavoritos));
    return unsub;
  }, [navigation]);

  const filtered = countries.filter(c => c.name.common.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={{ flex: 1 }}>
      <TextInput placeholder="Pesquisar país..." style={styles.search} value={search} onChangeText={setSearch} />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.name.common}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Detalhes', { country: item })} style={styles.card}>
            <Image source={{ uri: item.flags.png }} style={styles.flag} />
            <View style={{ flex: 1 }}>
              <Text style={styles.country}>{item.name.common}</Text>
              <Text style={styles.capital}>Capital: {item.capital?.[0]}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        )}
      />
      <BottomBar navigation={navigation} favoritos={favoritos} />
    </View>
  );
}

function Detalhes({ route }) {
  const { country } = route.params;

  const adicionarFavorito = async () => {
    const lista = await getFavoritos();
    if (lista.find(i => i.name.common === country.name.common)) {
      return Alert.alert('Esse país já está nos favoritos');
    }
    await saveFavoritos([...lista, country]);
    Alert.alert('Adicionado aos favoritos');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Image source={{ uri: country.flags.png }} style={{ width: '100%', height: 220 }} />
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold' }}>{country.name.common}</Text>
        <Text style={{ fontSize: 18, color: 'gray', marginBottom: 20 }}>{country.name.official}</Text>
        {[
          ['Capital', country.capital?.[0]],
          ['População', country.population],
          ['Região', country.region],
          ['Sub-região', country.subregion],
          ['Continente', country.continents?.[0]],
          ['Idioma', Object.values(country.languages || {}).join(', ')],
          ['Moeda', Object.values(country.currencies || {}).map(c => c.name).join(', ')],
          ['Fuso horário', country.timezones?.[0]],
        ].map(([label, value]) => (
          <Text key={label} style={{ fontSize: 18, marginBottom: 10 }}>{label}: {value}</Text>
        ))}
        <TouchableOpacity style={{ backgroundColor: '#1565FF', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 }} onPress={adicionarFavorito}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Adicionar aos Favoritos</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function Perfil({ navigation }) {
  const [foto, setFoto] = useState(null);
  const [totalFavoritos, setTotalFavoritos] = useState(0);
  const user = auth.currentUser;

  useEffect(() => {
    getFavoritos().then(lista => setTotalFavoritos(lista.length));
  }, []);

  const sair = () => {
    signOut(auth)
      .then(() => navigation.replace('Login'))
      .catch((error) => Alert.alert('Erro', error.message));
  };

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={{ uri: foto ?? "https://upload.wikimedia.org/wikipedia/en/8/80/SakuraKishimoto.jpg" }}
        style={{ width: 100, height: 100, borderRadius: 50 }}
      />
      <Text>Email: {user?.email}</Text>
      <Text>Favoritos: {totalFavoritos}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('AlterarFoto')}><Text>Alterar foto</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('AlterarSenha')}><Text>Alterar senha</Text></TouchableOpacity>
      <TouchableOpacity onPress={sair}><Text>Sair</Text></TouchableOpacity>
      <BottomBar navigation={navigation} />
    </View>
  );
}

function Favoritos({ navigation, route }) {
  const [favoritos, setFavoritos] = useState(route.params?.favoritos ?? []);

  useEffect(() => {
    getFavoritos().then(setFavoritos);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={favoritos}
        keyExtractor={(item) => item.name.common}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.flags.png }} style={styles.flag} />
            <View>
              <Text style={styles.country}>{item.name.common}</Text>
              <Text style={styles.capital}>Capital: {item.capital?.[0]}</Text>
            </View>
          </View>
        )}
      />
      <BottomBar navigation={navigation} favoritos={favoritos} />
    </View>
  );
}

function AlterarFoto({ navigation }) {
  const [foto, setFoto] = useState(null);

  return (
    <SafeAreaView>
      <View>
        <Image
          source={{ uri: foto ?? 'https://upload.wikimedia.org/wikipedia/en/8/80/SakuraKishimoto.jpg' }}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
        <Text>Escolha uma imagem</Text>
        <Text>Sua foto será enviada para o Cloudinary</Text>
        <TouchableOpacity><Text>Escolher da Galeria</Text></TouchableOpacity>
        <TouchableOpacity><Text>Tirar foto</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function AlterarSenha({ navigation }) {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [erro, setErro] = useState('');

  const alterar = async () => {
    if (!novaSenha || !confirmar) return setErro('Preencha todos os campos.');
    if (novaSenha.length < 6) return setErro('A senha deve ter pelo menos 6 caracteres.');
    if (novaSenha !== confirmar) return setErro('As senhas não coincidem.');
    try {
      await updatePassword(auth.currentUser, novaSenha);
      Alert.alert('Sucesso', 'Senha alterada com sucesso!');
      navigation.goBack();
    } catch (error) {
      setErro(error.message);
    }
  };

  return (
    <SafeAreaView>
      <View>
        <Text>Alterar Senha</Text>
        <TextInput placeholder='Nova senha' value={novaSenha} onChangeText={setNovaSenha} secureTextEntry autoCapitalize='none' />
        <TextInput placeholder='Confirmar nova senha' value={confirmar} onChangeText={setConfirmar} secureTextEntry autoCapitalize='none' />
        {erro ? <Text style={styles.erro}>{erro}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={alterar}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  webContainer: { flex: 1 },
  button: { backgroundColor: '#1565FF', padding: 15, borderRadius: 10, marginTop: 10 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  linkText: { color: 'blue', marginTop: 15, textAlign: 'center' },
  erro: { color: 'red', marginTop: 8, textAlign: 'center' },
  card: { backgroundColor: '#fff', margin: 8, padding: 15, borderRadius: 15, flexDirection: 'row', alignItems: 'center' },
  flag: { width: 55, height: 40, marginRight: 15 },
  country: { fontSize: 18, fontWeight: 'bold' },
  capital: { color: 'gray' },
  arrow: { fontSize: 25, color: 'gray' },
  search: { backgroundColor: '#fff', margin: 12, padding: 15, borderRadius: 12 },
  bottomBar: { flexDirection: 'row', justifyContent: 'space-around', padding: 15, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#ddd' },
});

export default App;
