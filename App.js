import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  Alert
} from 'react-native';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updatePassword } from "firebase/auth";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

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

// ─── Helpers Firestore ────────────────────────────────────────────────────────

async function getFavoritos() {
  const db = getFirestore(app);
  const uid = auth.currentUser.uid;
  const docSnap = await getDoc(doc(db, 'favoritos', uid));
  return docSnap.exists() ? docSnap.data().lista : [];
}

async function getPerfil() {
  const db = getFirestore(app);
  const uid = auth.currentUser.uid;
  const docSnap = await getDoc(doc(db, 'perfis', uid));
  return docSnap.exists() ? docSnap.data() : {};
}

async function alterarSenha(novaSenha) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');
    await updatePassword(user, novaSenha);
    return { success: true, message: 'Senha alterada com sucesso!' };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
}

// ─── BottomBar ────────────────────────────────────────────────────────────────

function BottomBar({ navigation, active }) {
  const tabs = [
    { name: 'TelaPrincipal', label: 'Início',    iconActive: 'home',          iconInactive: 'home-outline' },
    { name: 'Favoritos',     label: 'Favoritos', iconActive: 'heart',         iconInactive: 'heart-outline' },
    { name: 'Perfil',        label: 'Perfil',    iconActive: 'person',        iconInactive: 'person-outline' },
  ];

  return (
    <View style={styles.bottomBar}>
      {tabs.map((tab) => {
        const isActive = active === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.bottomBarItem}
            onPress={() => navigation.navigate(tab.name)}
          >
            <Ionicons
              name={isActive ? tab.iconActive : tab.iconInactive}
              size={24}
              color={isActive ? '#1565FF' : '#888'}
            />
            <Text style={[styles.bottomBarLabel, isActive && styles.bottomBarLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

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
            <Stack.Screen name="AlterarSenha" component={AlterarSenha} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </View>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────

function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const login = () => {
    if (!email || !senha) return setErro('Preencha todos os campos');
    signInWithEmailAndPassword(auth, email, senha)
      .then(() => navigation.replace('TelaPrincipal'))
      .catch(() => setErro("Email ou senha incorretos"));
  };

  return (
    <SafeAreaView>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>CONHEÇA O MUNDO</Text>
        <Text style={{ color: 'gray', marginBottom: 20 }}>Explore. Descubra. Viaje.</Text>
        <TextInput placeholder='Email' value={email} onChangeText={setEmail} autoCapitalize='none' autoComplete="new-password" style={styles.input} />
        <TextInput placeholder='Senha' value={senha} onChangeText={setSenha} autoCapitalize='none' secureTextEntry autoComplete="new-password" onSubmitEditing={login} style={styles.input} />
        {erro ? <Text style={styles.erro}>{erro}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={login}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.replace('Cadastro')}>
          <Text style={styles.linkText}>Ainda não tem uma conta? Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Cadastro ─────────────────────────────────────────────────────────────────

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
      .then(() => {
        Alert.alert('Sucesso', 'Conta criada!');
        navigation.replace('TelaPrincipal');
      })
      .catch((error) => setErro(error.message));
  };

  return (
    <SafeAreaView>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 8 }}>Criar Conta</Text>
        <Text style={{ color: 'gray', marginBottom: 20 }}>Preencha os dados para se cadastrar.</Text>
        <TextInput placeholder='Nome completo' value={nome} onChangeText={setNome} autoCapitalize='words' style={styles.input} />
        <TextInput placeholder='Email' value={email} onChangeText={setEmail} autoCapitalize='none' style={styles.input} />
        <TextInput placeholder='Senha' value={senha} onChangeText={setSenha} autoCapitalize='none' secureTextEntry style={styles.input} />
        <TextInput placeholder='Confirmar Senha' value={confsenha} onChangeText={setConfSenha} autoCapitalize='none' secureTextEntry style={styles.input} />
        {erro ? <Text style={styles.erro}>{erro}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={cadastrar}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Tela Principal ───────────────────────────────────────────────────────────

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
    data.sort((a, b) => a.name.common.localeCompare(b.name.common));
    setCountries(data);
  }

  function renderItem({ item }) {
    return (
      <TouchableOpacity onPress={() => navigation.navigate("Detalhes", { country: item })} style={styles.card}>
        <Image source={{ uri: item.flags.png }} style={styles.flag} />
        <View style={{ flex: 1 }}>
          <Text style={styles.country}>{item.name.common}</Text>
          <Text style={styles.capital}>Capital: {item.capital?.[0]}</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
    );
  }

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
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
      <BottomBar navigation={navigation} active="TelaPrincipal" />
    </View>
  );
}

// ─── Detalhes ─────────────────────────────────────────────────────────────────

function Detalhes({ route }) {
  const { country } = route.params;

  async function adicionarFavorito() {
    try {
      const db = getFirestore(app);

      if (!auth.currentUser) {
        alert('Usuário não autenticado');
        return;
      }

      const uid = auth.currentUser.uid;
      const favoritosRef = doc(db, 'favoritos', uid);
      const favoritosSnap = await getDoc(favoritosRef);

      let listaAtual = [];
      if (favoritosSnap.exists()) {
        listaAtual = favoritosSnap.data().lista || [];
      }

      const existe = listaAtual.some(item => item.nome === country.name.common);
      if (existe) {
        alert('Esse país já está nos favoritos');
        return;
      }

      const novoPais = {
        nome: country.name.common,
        capital: country.capital?.[0] || 'Sem capital',
        bandeira: country.flags.png,
        regiao: country.region,
      };

      await setDoc(favoritosRef, { lista: [...listaAtual, novoPais] });
      alert('País adicionado aos favoritos!');
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView>
        <Image source={{ uri: country.flags.png }} style={{ width: '100%', height: 220 }} />
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 32, fontWeight: 'bold' }}>{country.name.common}</Text>
          <Text style={{ fontSize: 18, color: 'gray', marginBottom: 20 }}>{country.name.official}</Text>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Capital: {country.capital?.[0]}</Text>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>População: {country.population?.toLocaleString()}</Text>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Região: {country.region}</Text>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Sub-região: {country.subregion}</Text>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Continente: {country.continents?.[0]}</Text>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Idioma: {Object.values(country.languages || {}).join(', ')}</Text>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>
            Moeda: {Object.values(country.currencies || {}).map((c) => c.name).join(', ')}
          </Text>
          <Text style={{ fontSize: 18, marginBottom: 20 }}>Fuso horário: {country.timezones?.[0]}</Text>
          <TouchableOpacity
            style={{ backgroundColor: '#1565FF', padding: 18, borderRadius: 12, alignItems: 'center' }}
            onPress={adicionarFavorito}
          >
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Adicionar aos Favoritos</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Perfil ───────────────────────────────────────────────────────────────────

function Perfil({ navigation }) {
  const [foto, setFoto] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadFoto);
    return unsubscribe;
  }, [navigation]);

  async function loadFoto() {
    const perfil = await getPerfil();
    if (perfil.foto) setFoto(perfil.foto);
  }

  const sair = () => {
    signOut(auth)
      .then(() => navigation.replace('Login'))
      .catch((error) => Alert.alert('Erro', error.message));
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Conteúdo cresce e empurra a barra para baixo */}
      <View style={{ flex: 1, padding: 20 }}>
        <Image
          source={foto
            ? { uri: foto }
            : { uri: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png" }
          }
          style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 16 }}
        />
        <Text style={{ fontSize: 16, marginBottom: 20 }}>Email: {user?.email}</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AlterarFoto')}>
          <Text style={styles.buttonText}>Alterar foto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { marginTop: 10 }]} onPress={() => navigation.navigate('AlterarSenha')}>
          <Text style={styles.buttonText}>Alterar senha</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#c0392b', marginTop: 10 }]} onPress={sair}>
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>
      </View>
      <BottomBar navigation={navigation} active="Perfil" />
    </View>
  );
}

// ─── Favoritos ────────────────────────────────────────────────────────────────

function Favoritos({ navigation }) {
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadFavoritos);
    return unsubscribe;
  }, [navigation]);

  async function loadFavoritos() {
    try {
      const lista = await getFavoritos();
      setFavoritos(lista);
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  }

  async function removerFavorito(nome) {
    try {
      const db = getFirestore(app);
      const uid = auth.currentUser.uid;
      const novaLista = favoritos.filter(item => item.nome !== nome);
      await setDoc(doc(db, 'favoritos', uid), { lista: novaLista });
      setFavoritos(novaLista);
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={favoritos}
        keyExtractor={(item) => item.nome}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 40, color: 'gray' }}>
            Nenhum favorito ainda.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { justifyContent: 'space-between' }]}>
            <Image source={{ uri: item.bandeira }} style={styles.flag} />
            <View style={{ flex: 1 }}>
              <Text style={styles.country}>{item.nome}</Text>
              <Text style={styles.capital}>Capital: {item.capital}</Text>
            </View>
            <TouchableOpacity onPress={() => removerFavorito(item.nome)}>
              <Text style={{ color: 'red', fontSize: 18 }}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <BottomBar navigation={navigation} active="Favoritos" />
    </View>
  );
}

// ─── Alterar Foto ─────────────────────────────────────────────────────────────

function AlterarFoto({ navigation }) {
  const [imagem, setImagem] = useState(null);
  const [loading, setLoading] = useState(false);

  async function escolherImagem() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert('Permissão negada');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.4,
      allowsEditing: true,
      base64: true,
    });

    if (!result.canceled) {
      setImagem(result.assets[0]);
    }
  }

  async function salvar() {
    try {
      if (!imagem) {
        alert('Escolha uma imagem');
        return;
      }

      setLoading(true);

      const uid = auth.currentUser.uid;
      const db = getFirestore(app);
      const perfilAtual = await getPerfil();

      const base64Uri = `data:image/jpeg;base64,${imagem.base64}`;

      await setDoc(doc(db, 'perfis', uid), {
        ...perfilAtual,
        foto: base64Uri,
      });

      alert('Foto salva!');
      navigation.goBack();
    } catch (error) {
      console.log(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 20 }}>
        <TouchableOpacity style={styles.button} onPress={escolherImagem}>
          <Text style={styles.buttonText}>Escolher Foto</Text>
        </TouchableOpacity>
        {imagem && (
          <Image
            source={{ uri: imagem.uri }}
            style={{ width: 150, height: 150, borderRadius: 75, alignSelf: 'center', marginVertical: 20 }}
          />
        )}
        <TouchableOpacity style={styles.button} onPress={salvar}>
          <Text style={styles.buttonText}>{loading ? 'Salvando...' : 'Salvar Foto'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Alterar Senha ────────────────────────────────────────────────────────────

function AlterarSenha({ navigation }) {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const alterar = async () => {
    setErro('');

    if (!novaSenha || !confirmar) return setErro('Preencha todos os campos.');
    if (novaSenha.length < 6) return setErro('A senha deve ter pelo menos 6 caracteres.');
    if (novaSenha !== confirmar) return setErro('As senhas não coincidem.');

    setLoading(true);
    const resultado = await alterarSenha(novaSenha);
    setLoading(false);

    if (resultado.success) {
      alert('Senha alterada com sucesso!');
      navigation.goBack();
    } else {
      if (resultado.message.includes('requires-recent-login')) {
        setErro('Por segurança, saia e entre novamente antes de alterar a senha.');
      } else {
        setErro(resultado.message);
      }
    }
  };

  return (
    <SafeAreaView>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>Alterar Senha</Text>
        <TextInput
          placeholder='Nova senha'
          value={novaSenha}
          onChangeText={setNovaSenha}
          secureTextEntry
          autoCapitalize='none'
          style={styles.input}
        />
        <TextInput
          placeholder='Confirmar nova senha'
          value={confirmar}
          onChangeText={setConfirmar}
          secureTextEntry
          autoCapitalize='none'
          style={styles.input}
          onSubmitEditing={alterar}
        />
        {erro ? <Text style={styles.erro}>{erro}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={alterar} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Salvando...' : 'Salvar'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  webContainer: { flex: 1 },
  appWrapper: { flex: 1 },
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
  erro: {
    color: 'red',
    marginTop: 8,
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
    paddingVertical: 10,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
  },
  bottomBarItem: {
    alignItems: 'center',
    flex: 1,
  },
  bottomBarLabel: {
    fontSize: 11,
    color: '#888',
    marginTop: 3,
  },
  bottomBarLabelActive: {
    color: '#1565FF',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f0f0f0', // ← BUG CORRIGIDO: aspas faltando no original
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
});

export default App;
