import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, SafeAreaView,
  StyleSheet, ScrollView, Image, FlatList, Alert
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
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

function InputField({ icon, placeholder, value, onChangeText, secureTextEntry, keyboardType, autoCapitalize, onSubmitEditing, autoComplete, showToggle, onToggle, visible }) {
  return (
    <View style={s.inputWrapper}>
      <Ionicons name={icon} size={18} color="#888" style={{ marginRight: 10 }} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && !visible}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize || 'none'}
        onSubmitEditing={onSubmitEditing}
        autoComplete={autoComplete}
        style={[s.inputField, showToggle && { flex: 1 }]}
      />
      {showToggle && (
        <TouchableOpacity onPress={onToggle} style={{ paddingHorizontal: 8 }}>
          <Ionicons name={visible ? 'eye-outline' : 'eye-off-outline'} size={18} color="#888" />
        </TouchableOpacity>
      )}
    </View>
  );
}

function BottomBar({ navigation, active }) {
  const tabs = [
    { name: 'TelaPrincipal', label: 'Início', iconOn: 'home', iconOff: 'home-outline' },
    { name: 'Favoritos', label: 'Favoritos', iconOn: 'heart', iconOff: 'heart-outline' },
    { name: 'Perfil', label: 'Perfil', iconOn: 'person', iconOff: 'person-outline' },
  ];
  return (
    <View style={s.bottomBar}>
      {tabs.map(tab => {
        const on = active === tab.name;
        return (
          <TouchableOpacity key={tab.name} style={s.bottomBarItem} onPress={() => navigation.navigate(tab.name)}>
            <Ionicons name={on ? tab.iconOn : tab.iconOff} size={24} color={on ? '#1565FF' : '#888'} />
            <Text style={[s.bottomBarLabel, on && s.bottomBarLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function App() {
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Cadastro" component={Cadastro} options={{ headerShown: false }} />
          <Stack.Screen name="TelaPrincipal" component={TelaPrincipal} options={{ headerShown: false }} />
          <Stack.Screen name="Detalhes" component={Detalhes} />
          <Stack.Screen name="Favoritos" component={Favoritos} options={{ headerShown: false }} />
          <Stack.Screen name="Perfil" component={Perfil} options={{ headerShown: false }} />
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
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');

  const login = () => {
    if (!email || !senha) return setErro('Preencha todos os campos');
    signInWithEmailAndPassword(auth, email, senha)
      .then(() => navigation.replace('TelaPrincipal'))
      .catch(() => setErro('Email ou senha incorretos'));
  };

  return (
    <SafeAreaView style={[s.screen, { backgroundColor: '#EEF2FF' }]}>
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <View style={s.loginHero}>
          <Text style={{ fontSize: 90 }}>🌍</Text>
          <Text style={s.heroTitle}>CONHEÇA{'\n'}O MUNDO</Text>
          <Text style={s.heroSubtitle}>Explore. Descubra. Viaje.</Text>
        </View>
        <View style={s.loginCard}>
          <InputField icon="mail-outline" placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoComplete="new-password" />
          <InputField icon="lock-closed-outline" placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry autoComplete="new-password" onSubmitEditing={login} showToggle visible={mostrarSenha} onToggle={() => setMostrarSenha(!mostrarSenha)} />
          {erro ? <Text style={s.erro}>{erro}</Text> : null}
          <TouchableOpacity style={s.btn} onPress={login} activeOpacity={0.85}>
            <Text style={s.btnText}>Entrar</Text>
          </TouchableOpacity>
          <View style={s.rowCenter}>
            <Text style={s.muted}>Ainda não tem conta? </Text>
            <TouchableOpacity onPress={() => navigation.replace('Cadastro')}>
              <Text style={s.link}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Cadastro({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confsenha, setConfSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConf, setMostrarConf] = useState(false);
  const [erro, setErro] = useState('');

  const cadastrar = () => {
    setErro('');
    if (!nome || !email || !senha) return setErro('Preencha todos os campos!');
    if (senha.length < 6) return setErro('A senha deve ter pelo menos 6 caracteres.');
    if (senha !== confsenha) return setErro('As senhas não coincidem.');
    createUserWithEmailAndPassword(auth, email, senha)
      .then(async (cred) => {
        const db = getFirestore(app);
        await setDoc(doc(db, 'perfis', cred.user.uid), { nome, foto: null, paisesVisitados: 0, resenhas: 0 });
        Alert.alert('Sucesso', 'Conta criada!');
        navigation.replace('TelaPrincipal');
      })
      .catch(e => setErro(e.message));
  };

  return (
    <SafeAreaView style={s.screen}>
      <ScrollView contentContainerStyle={{ padding: 28 }} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.replace('Login')}>
          <Ionicons name="arrow-back" size={22} color="#222" />
        </TouchableOpacity>
        <Text style={s.pageTitle}>Criar Conta</Text>
        <Text style={s.muted}>Preencha os dados para se cadastrar</Text>
        <View style={{ marginTop: 24 }}>
          <InputField icon="person-outline" placeholder="Nome completo" value={nome} onChangeText={setNome} autoCapitalize="words" />
          <InputField icon="mail-outline" placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <InputField icon="lock-closed-outline" placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry showToggle visible={mostrarSenha} onToggle={() => setMostrarSenha(!mostrarSenha)} />
          <InputField icon="lock-closed-outline" placeholder="Confirmar senha" value={confsenha} onChangeText={setConfSenha} secureTextEntry showToggle visible={mostrarConf} onToggle={() => setMostrarConf(!mostrarConf)} onSubmitEditing={cadastrar} />
        </View>
        {erro ? <Text style={s.erro}>{erro}</Text> : null}
        <TouchableOpacity style={s.btn} onPress={cadastrar} activeOpacity={0.85}>
          <Text style={s.btnText}>Cadastrar</Text>
        </TouchableOpacity>
        <View style={s.rowCenter}>
          <Text style={s.muted}>Já tem conta? </Text>
          <TouchableOpacity onPress={() => navigation.replace('Login')}>
            <Text style={s.link}>Faça login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TelaPrincipal({ navigation }) {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name,capital,flags,region,subregion,population,languages,currencies,continents,timezones')
      .then(r => r.json())
      .then(data => setCountries(data.sort((a, b) => a.name.common.localeCompare(b.name.common))));
  }, []);

  const filtered = countries.filter(c => c.name.common.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F7FF' }}>
      <View style={s.topBar}>
        <TouchableOpacity style={s.topBarIcon}><Ionicons name="menu" size={22} color="#fff" /></TouchableOpacity>
        <Text style={s.topBarTitle}>Países</Text>
        <TouchableOpacity style={s.topBarIcon}><Ionicons name="notifications-outline" size={22} color="#fff" /></TouchableOpacity>
      </View>
      <View style={s.searchWrapper}>
        <Ionicons name="search" size={16} color="#aaa" style={{ marginRight: 8 }} />
        <TextInput placeholder="Pesquisar país..." placeholderTextColor="#aaa" style={s.searchInput} value={search} onChangeText={setSearch} />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={item => item.name.common}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={s.card} onPress={() => navigation.navigate('Detalhes', { country: item })}>
            <Image source={{ uri: item.flags.png }} style={s.flag} />
            <View style={{ flex: 1 }}>
              <Text style={s.countryName}>{item.name.common}</Text>
              <Text style={s.capital}>Capital: {item.capital?.[0]}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#bbb" />
          </TouchableOpacity>
        )}
      />
      <BottomBar navigation={navigation} active="TelaPrincipal" />
    </View>
  );
}

function Detalhes({ route }) {
  const { country } = route.params;
  const [isFavorito, setIsFavorito] = useState(false);

  useEffect(() => {
    getFavoritos().then(lista => setIsFavorito(lista.some(i => i.nome === country.name.common)));
  }, []);

  async function toggleFavorito() {
    try {
      if (!auth.currentUser) return alert('Usuário não autenticado');
      const db = getFirestore(app);
      const uid = auth.currentUser.uid;
      const ref = doc(db, 'favoritos', uid);
      const snap = await getDoc(ref);
      const lista = snap.exists() ? snap.data().lista || [] : [];
      if (isFavorito) {
        await setDoc(ref, { lista: lista.filter(i => i.nome !== country.name.common) });
        setIsFavorito(false);
      } else {
        await setDoc(ref, { lista: [...lista, { nome: country.name.common, capital: country.capital?.[0] || 'Sem capital', bandeira: country.flags.png, regiao: country.region, countryData: country }] });
        setIsFavorito(true);
      }
    } catch (e) { alert(e.message); }
  }

  const rows = [
    ['location-outline', 'Capital', country.capital?.[0]],
    ['people-outline', 'População', country.population?.toLocaleString()],
    ['chatbubble-outline', 'Idioma', Object.values(country.languages || {}).join(', ')],
    ['cash-outline', 'Moeda', Object.values(country.currencies || {}).map(c => c.name).join(', ')],
    ['earth-outline', 'Região', country.region],
    ['map-outline', 'Sub-região', country.subregion],
    ['globe-outline', 'Continente', country.continents?.[0]],
    ['time-outline', 'Fuso horário', country.timezones?.[0]],
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView>
        <Image source={{ uri: country.flags.png }} style={s.detailsBanner} />
        <View style={s.detailsCard}>
          <Image source={{ uri: country.flags.png }} style={s.detailsFlagSmall} />
          <Text style={s.detailsName}>{country.name.common}</Text>
          <Text style={s.detailsOfficialName}>{country.name.official}</Text>
          {rows.map(([icon, label, value]) => (
            <View key={label} style={s.detailsRow}>
              <View style={s.detailsRowLeft}>
                <Ionicons name={icon} size={18} color="#1565FF" style={{ marginRight: 10 }} />
                <Text style={s.detailsLabel}>{label}</Text>
              </View>
              <Text style={s.detailsValue}>{value}</Text>
            </View>
          ))}
          <TouchableOpacity style={[s.btn, { marginTop: 20, flexDirection: 'row', gap: 8, backgroundColor: isFavorito ? '#e53935' : '#1565FF' }]} onPress={toggleFavorito}>
            <Ionicons name={isFavorito ? 'heart-dislike' : 'heart'} size={18} color="#fff" />
            <Text style={s.btnText}>{isFavorito ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Perfil({ navigation }) {
  const [foto, setFoto] = useState(null);
  const [nome, setNome] = useState('');
  const [stats, setStats] = useState({ favoritos: 0, paisesVisitados: 0, resenhas: 0 });
  const user = auth.currentUser;

  useEffect(() => {
    const unsub = navigation.addListener('focus', async () => {
      const [p, favs] = await Promise.all([getPerfil(), getFavoritos()]);
      if (p.foto) setFoto(p.foto);
      if (p.nome) setNome(p.nome);
      setStats({ favoritos: favs.length, paisesVisitados: p.paisesVisitados || 0, resenhas: p.resenhas || 0 });
    });
    return unsub;
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F7FF' }}>
      <View style={s.topBar}>
        <TouchableOpacity style={s.topBarIcon}><Ionicons name="menu" size={22} color="#fff" /></TouchableOpacity>
        <Text style={s.topBarTitle}>Meu Perfil</Text>
        <TouchableOpacity style={s.topBarIcon}><Ionicons name="create-outline" size={22} color="#fff" /></TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 20, paddingBottom: 24 }}>
        <View style={s.avatarWrapper}>
          <Image
            source={{ uri: foto || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png' }}
            style={s.avatar}
          />
          <View style={s.avatarBadge}>
            <Ionicons name="camera" size={14} color="#fff" />
          </View>
        </View>
        <Text style={s.profileName}>{nome || user?.email?.split('@')[0] || 'Usuário'}</Text>
        <Text style={s.profileEmail}>{user?.email}</Text>
        <View style={s.statsRow}>
          <View style={s.statItem}><Text style={s.statNum}>{stats.favoritos}</Text><Text style={s.statLabel}>Favoritos</Text></View>
          <View style={s.statDivider} />
          <View style={s.statItem}><Text style={s.statNum}>{stats.paisesVisitados}</Text><Text style={s.statLabel}>Países visitados</Text></View>
          <View style={s.statDivider} />
          <View style={s.statItem}><Text style={s.statNum}>{stats.resenhas}</Text><Text style={s.statLabel}>Resenhas</Text></View>
        </View>
        <View style={s.menuCard}>
          {[
            { icon: 'pencil-outline', label: 'Editar Perfil', onPress: () => { } },
            { icon: 'camera-outline', label: 'Alterar Foto', onPress: () => navigation.navigate('AlterarFoto') },
            { icon: 'lock-closed-outline', label: 'Alterar Senha', onPress: () => navigation.navigate('AlterarSenha') },
          ].map((item, i, arr) => (
            <TouchableOpacity key={item.label} style={[s.menuItem, i < arr.length - 1 && s.menuItemBorder]} onPress={item.onPress}>
              <Ionicons name={item.icon} size={20} color="#444" style={{ marginRight: 14 }} />
              <Text style={s.menuItemLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={s.menuCard} onPress={() => signOut(auth).then(() => navigation.replace('Login'))}>
          <View style={s.menuItem}>
            <Ionicons name="log-out-outline" size={20} color="#e53935" style={{ marginRight: 14 }} />
            <Text style={[s.menuItemLabel, { color: '#e53935' }]}>Sair</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
      <BottomBar navigation={navigation} active="Perfil" />
    </View>
  );
}

function Favoritos({ navigation }) {
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    const unsub = navigation.addListener('focus', async () => {
      try { setFavoritos(await getFavoritos()); } catch (e) { Alert.alert('Erro', e.message); }
    });
    return unsub;
  }, [navigation]);

  async function remover(nome) {
    try {
      const db = getFirestore(app);
      const uid = auth.currentUser.uid;
      const nova = favoritos.filter(i => i.nome !== nome);
      await setDoc(doc(db, 'favoritos', uid), { lista: nova });
      setFavoritos(nova);
    } catch (e) { Alert.alert('Erro', e.message); }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F7FF' }}>
      <View style={s.topBar}>
        <TouchableOpacity style={s.topBarIcon}><Ionicons name="menu" size={22} color="#fff" /></TouchableOpacity>
        <Text style={s.topBarTitle}>Meus Favoritos</Text>
        <View style={s.topBarIcon} />
      </View>
      <FlatList
        data={favoritos}
        keyExtractor={item => item.nome}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 40, color: 'gray' }}>Nenhum favorito ainda.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={s.favCard} onPress={async () => {
            if (item.countryData) return navigation.navigate('Detalhes', { country: item.countryData });
            try {
              const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(item.nome)}?fullText=true&fields=name,capital,flags,region,subregion,population,languages,currencies,continents,timezones`);
              const data = await res.json();
              if (data?.[0]) navigation.navigate('Detalhes', { country: data[0] });
            } catch (e) { Alert.alert('Erro', 'Não foi possível carregar os detalhes.'); }
          }}>
            <Image source={{ uri: item.bandeira }} style={s.favImage} />
            <View style={s.favInfo}>
              <Text style={s.countryName}>{item.nome}</Text>
              <Text style={s.capital}>Capital: {item.capital}</Text>
            </View>
            <TouchableOpacity onPress={() => remover(item.nome)} style={{ padding: 8 }}>
              <Ionicons name="heart" size={24} color="#e53935" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
      <BottomBar navigation={navigation} active="Favoritos" />
    </View>
  );
}

function AlterarFoto({ navigation }) {
  const [imagem, setImagem] = useState(null);
  const [loading, setLoading] = useState(false);

  async function escolher() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return alert('Permissão negada');
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7, allowsEditing: true, base64: true });
    if (!result.canceled) setImagem(result.assets[0]);
  }

  async function salvar() {
  if (!imagem) return alert('Escolha uma imagem');
  setLoading(true);
  try {
    const CLOUD_NAME = 'dgpfajxgl';
    const UPLOAD_PRESET = 'att7prog_upload';

    const response = await fetch(imagem.uri);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append('file', blob, 'profile.jpg');
    formData.append('upload_preset', UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    console.log('STATUS:', res.status);
    console.log('RESPOSTA:', JSON.stringify(data));

    if (!data.secure_url) throw new Error(data.error?.message || 'Falha no upload');

    const db = getFirestore(app);
    const uid = auth.currentUser.uid;
    const perfilAtual = await getPerfil();
    await setDoc(doc(db, 'perfis', uid), { ...perfilAtual, foto: data.secure_url });

    alert('Foto salva!');
    navigation.goBack();
  } catch (e) {
    alert(e.message);
  } finally {
    setLoading(false);
  }
}

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 28 }}>
        <View style={s.uploadAvatarWrapper}>
          <Image
            source={{ uri: imagem?.uri || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png' }}
            style={s.uploadAvatar}
          />
          <View style={s.avatarBadge}>
            <Ionicons name="camera" size={14} color="#fff" />
          </View>
        </View>
        <Text style={s.uploadTitle}>{imagem ? 'Imagem selecionada' : 'Escolha uma imagem'}</Text>
        <Text style={s.uploadSub}>Sua foto será enviada para a nuvem</Text>
        <TouchableOpacity style={s.uploadBtn} onPress={escolher}>
          <Ionicons name="images-outline" size={20} color="#1565FF" style={{ marginRight: 10 }} />
          <Text style={s.uploadBtnText}>{imagem ? 'Trocar imagem' : 'Escolher da Galeria'}</Text>
        </TouchableOpacity>
        {imagem && (
          <TouchableOpacity style={[s.btn, { width: '100%', marginTop: 12, flexDirection: 'row', gap: 8 }]} onPress={salvar}>
            <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
            <Text style={s.btnText}>{loading ? 'Salvando...' : 'Confirmar e Salvar'}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

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
    if (resultado.success) { alert('Senha alterada!'); navigation.goBack(); }
    else setErro(resultado.message.includes('requires-recent-login') ? 'Saia e entre novamente antes de alterar a senha.' : resultado.message);
  };

  return (
    <SafeAreaView style={s.screen}>
      <View style={{ padding: 20 }}>
        <Text style={s.pageTitle}>Alterar Senha</Text>
        <InputField icon="lock-closed-outline" placeholder="Nova senha" value={novaSenha} onChangeText={setNovaSenha} secureTextEntry />
        <InputField icon="lock-closed-outline" placeholder="Confirmar nova senha" value={confirmar} onChangeText={setConfirmar} secureTextEntry onSubmitEditing={alterar} />
        {erro ? <Text style={s.erro}>{erro}</Text> : null}
        <TouchableOpacity style={[s.btn, { marginTop: 10 }]} onPress={alterar} disabled={loading}>
          <Text style={s.btnText}>{loading ? 'Salvando...' : 'Salvar'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },

  loginHero: { alignItems: 'center', paddingTop: 48, paddingBottom: 28 },
  heroTitle: { fontSize: 34, fontWeight: '900', color: '#1565FF', textAlign: 'center', letterSpacing: 1, lineHeight: 40, marginTop: 8 },
  heroSubtitle: { fontSize: 14, color: '#666', marginTop: 8, letterSpacing: 0.5 },
  loginCard: { width: '100%', paddingHorizontal: 28 },

  topBar: { backgroundColor: '#1565FF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 48, paddingBottom: 14 },
  topBarTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  topBarIcon: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },

  searchWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 14, borderRadius: 12, paddingHorizontal: 14, height: 46, borderWidth: 1, borderColor: '#e8eaf0', elevation: 2 },
  searchInput: { flex: 1, fontSize: 14, color: '#222' },

  card: { backgroundColor: '#fff', marginBottom: 10, padding: 14, borderRadius: 14, flexDirection: 'row', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  flag: { width: 58, height: 40, marginRight: 14, borderRadius: 6 },
  countryName: { fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 2 },
  capital: { color: '#888', fontSize: 13 },

  detailsBanner: { width: '100%', height: 220 },
  detailsCard: { padding: 20 },
  detailsFlagSmall: { width: 52, height: 36, borderRadius: 4, marginBottom: 10 },
  detailsName: { fontSize: 30, fontWeight: '800', color: '#111', marginBottom: 2 },
  detailsOfficialName: { fontSize: 14, color: '#888', marginBottom: 20 },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  detailsRowLeft: { flexDirection: 'row', alignItems: 'center' },
  detailsLabel: { fontSize: 15, color: '#444', fontWeight: '500' },
  detailsValue: { fontSize: 15, color: '#111', fontWeight: '600', maxWidth: '50%', textAlign: 'right' },

  avatarWrapper: { marginTop: 20, marginBottom: 10, position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#fff', elevation: 4 },
  avatarBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#1565FF', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  profileName: { fontSize: 20, fontWeight: '800', color: '#111', marginBottom: 2 },
  profileEmail: { fontSize: 13, color: '#888', marginBottom: 18 },
  statsRow: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 20, width: '100%', elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, marginBottom: 20 },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 20, fontWeight: '800', color: '#1565FF' },
  statLabel: { fontSize: 11, color: '#888', marginTop: 2, textAlign: 'center' },
  statDivider: { width: 1, backgroundColor: '#eee' },

  menuCard: { backgroundColor: '#fff', borderRadius: 16, width: '100%', elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, marginBottom: 14, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 18 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  menuItemLabel: { flex: 1, fontSize: 15, color: '#222', fontWeight: '500' },

  favCard: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  favImage: { width: 90, height: 70 },
  favInfo: { flex: 1, paddingHorizontal: 14 },

  uploadAvatarWrapper: { position: 'relative', marginBottom: 16 },
  uploadAvatar: { width: 130, height: 130, borderRadius: 65, borderWidth: 3, borderColor: '#e0e7ff' },
  uploadTitle: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 4 },
  uploadSub: { fontSize: 13, color: '#888', marginBottom: 28 },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', width: '100%', borderWidth: 1.5, borderColor: '#1565FF', borderRadius: 12, height: 52, justifyContent: 'center', marginBottom: 4 },
  uploadBtnText: { color: '#1565FF', fontSize: 15, fontWeight: '700' },

  pageTitle: { fontSize: 28, fontWeight: '800', color: '#111', marginBottom: 6, marginTop: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#dde3f0', marginBottom: 14, paddingHorizontal: 14, height: 52, elevation: 1 },
  inputField: { flex: 1, fontSize: 15, color: '#222' },
  btn: { backgroundColor: '#1565FF', borderRadius: 12, height: 52, alignItems: 'center', justifyContent: 'center', marginTop: 4, elevation: 3 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  erro: { color: '#e53935', fontSize: 13, textAlign: 'center', marginBottom: 10 },
  muted: { color: '#888', fontSize: 14 },
  link: { color: '#1565FF', fontSize: 14, fontWeight: '700' },
  rowCenter: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  backBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#f0f4ff', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  bottomBar: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, paddingBottom: 16, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#e0e0e0' },
  bottomBarItem: { alignItems: 'center', flex: 1 },
  bottomBarLabel: { fontSize: 11, color: '#888', marginTop: 3 },
  bottomBarLabelActive: { color: '#1565FF', fontWeight: '600' },
});

export default App;
