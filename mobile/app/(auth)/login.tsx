import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router, Link } from 'expo-router';
import { api } from '../../lib/api';
import { saveAuth } from '../../lib/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { Alert.alert('Erreur', 'Remplissez tous les champs'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      await saveAuth(data.user, data.token);
      router.replace('/(tabs)/home');
    } catch (err: any) {
      Alert.alert('Erreur', err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.logo}>Qestra</Text>
        <Text style={s.subtitle}>Connectez-vous</Text>
        <View style={s.card}>
          <Text style={s.label}>Email</Text>
          <TextInput style={s.input} value={email} onChangeText={setEmail} placeholder="votre@email.com" keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#9CA3AF" />
          <Text style={s.label}>Mot de passe</Text>
          <TextInput style={s.input} value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry placeholderTextColor="#9CA3AF" />
          <TouchableOpacity style={[s.btn, loading && {opacity:0.6}]} onPress={handleLogin} disabled={loading}>
            <Text style={s.btnText}>{loading ? 'Connexion...' : 'Se connecter'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setEmail('client@test.com'); setPassword('password123'); }} style={{marginTop:12,alignItems:'center'}}>
            <Text style={{color:'#9CA3AF',fontSize:13}}>🧪 Remplir compte test</Text>
          </TouchableOpacity>
        </View>
        <Text style={s.footer}>Pas de compte ? <Link href="/(auth)/register" style={{color:'#7C3AED',fontWeight:'600'}}>S'inscrire</Link></Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container:{flex:1,backgroundColor:'#F5F3FF'},
  scroll:{flexGrow:1,justifyContent:'center',padding:24},
  logo:{fontSize:32,fontWeight:'800',color:'#7C3AED',textAlign:'center'},
  subtitle:{fontSize:16,color:'#6B7280',textAlign:'center',marginTop:8,marginBottom:32},
  card:{backgroundColor:'#fff',borderRadius:20,padding:24,shadowColor:'#000',shadowOpacity:0.08,shadowRadius:12,elevation:4},
  label:{fontSize:14,fontWeight:'600',color:'#374151',marginBottom:6,marginTop:12},
  input:{borderWidth:1,borderColor:'#E5E7EB',borderRadius:12,paddingHorizontal:16,paddingVertical:12,fontSize:15,color:'#111827',backgroundColor:'#FAFAFA'},
  btn:{backgroundColor:'#7C3AED',borderRadius:12,paddingVertical:16,alignItems:'center',marginTop:20},
  btnText:{color:'#fff',fontSize:16,fontWeight:'700'},
  footer:{textAlign:'center',marginTop:24,color:'#6B7280',fontSize:14},
});
