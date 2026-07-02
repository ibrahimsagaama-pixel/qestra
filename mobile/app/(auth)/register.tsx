import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router, Link } from 'expo-router';
import { api } from '../../lib/api';
import { saveAuth } from '../../lib/auth';

export default function RegisterScreen() {
  const [role, setRole] = useState<'CLIENT'|'PROVIDER'>('CLIENT');
  const [form, setForm] = useState({firstName:'',lastName:'',email:'',phone:'',password:''});
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!form.firstName||!form.email||!form.password){Alert.alert('Erreur','Champs obligatoires manquants');return;}
    setLoading(true);
    try {
      const {data} = await api.post('/auth/register',{...form,role});
      await saveAuth(data.user,data.token);
      router.replace('/(tabs)/home');
    } catch(err:any){Alert.alert('Erreur',err.response?.data?.message||'Erreur');}
    finally{setLoading(false);}
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS==='ios'?'padding':undefined}>
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.logo}>Qestra</Text>
        <Text style={s.subtitle}>Créez votre compte</Text>
        <View style={s.card}>
          <View style={s.toggle}>
            {(['CLIENT','PROVIDER'] as const).map(r=>(
              <TouchableOpacity key={r} style={[s.togBtn,role===r&&s.togActive]} onPress={()=>setRole(r)}>
                <Text style={[s.togText,role===r&&s.togTextActive]}>{r==='CLIENT'?'👤 Client':'🏢 Prestataire'}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{flexDirection:'row',gap:8}}>
            <View style={{flex:1}}><Text style={s.label}>Prénom *</Text><TextInput style={s.input} value={form.firstName} onChangeText={v=>setForm({...form,firstName:v})} placeholderTextColor="#9CA3AF" placeholder="Prénom"/></View>
            <View style={{flex:1}}><Text style={s.label}>Nom</Text><TextInput style={s.input} value={form.lastName} onChangeText={v=>setForm({...form,lastName:v})} placeholderTextColor="#9CA3AF" placeholder="Nom"/></View>
          </View>
          <Text style={s.label}>Email *</Text>
          <TextInput style={s.input} value={form.email} onChangeText={v=>setForm({...form,email:v})} placeholder="email@example.com" keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#9CA3AF"/>
          <Text style={s.label}>Téléphone</Text>
          <TextInput style={s.input} value={form.phone} onChangeText={v=>setForm({...form,phone:v})} placeholder="+213 6xx" keyboardType="phone-pad" placeholderTextColor="#9CA3AF"/>
          <Text style={s.label}>Mot de passe *</Text>
          <TextInput style={s.input} value={form.password} onChangeText={v=>setForm({...form,password:v})} placeholder="Min 6 caractères" secureTextEntry placeholderTextColor="#9CA3AF"/>
          <TouchableOpacity style={[s.btn,loading&&{opacity:0.6}]} onPress={handleRegister} disabled={loading}>
            <Text style={s.btnText}>{loading?'Création...':'Créer mon compte'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={s.footer}>Déjà un compte ? <Link href="/(auth)/login" style={{color:'#7C3AED',fontWeight:'600'}}>Se connecter</Link></Text>
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
  toggle:{flexDirection:'row',backgroundColor:'#F3F4F6',borderRadius:12,padding:4,marginBottom:16},
  togBtn:{flex:1,paddingVertical:10,alignItems:'center',borderRadius:10},
  togActive:{backgroundColor:'#fff',shadowColor:'#000',shadowOpacity:0.1,shadowRadius:4,elevation:2},
  togText:{fontSize:14,color:'#6B7280',fontWeight:'500'},
  togTextActive:{color:'#7C3AED',fontWeight:'700'},
  label:{fontSize:13,fontWeight:'600',color:'#374151',marginBottom:5,marginTop:12},
  input:{borderWidth:1,borderColor:'#E5E7EB',borderRadius:12,paddingHorizontal:14,paddingVertical:11,fontSize:14,color:'#111827',backgroundColor:'#FAFAFA'},
  btn:{backgroundColor:'#7C3AED',borderRadius:12,paddingVertical:16,alignItems:'center',marginTop:20},
  btnText:{color:'#fff',fontSize:16,fontWeight:'700'},
  footer:{textAlign:'center',marginTop:24,color:'#6B7280',fontSize:14},
});
