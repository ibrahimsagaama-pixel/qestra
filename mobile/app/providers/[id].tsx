import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { api } from '../../lib/api';
import { getUser } from '../../lib/auth';

const EVENTS=['WEDDING','ANNIVERSARY','BIRTHDAY','PARTY','DINNER','CORPORATE','OTHER'];
const EL:Record<string,string>={WEDDING:'💍 Mariage',ANNIVERSARY:'🥂 Anniv.',BIRTHDAY:'🎂 Fête',PARTY:'🎉 Soirée',DINNER:'🍽️ Dîner',CORPORATE:'💼 Pro',OTHER:'✨ Autre'};
const CL:Record<string,string>={BAND:'🎵',FLORIST:'💐',CAKE:'🎂',HOST:'🎤',DECORATOR:'🎨',PHOTOGRAPHER:'📸',VENUE:'🏛️',CATERING:'🍽️'};

export default function ProviderDetail() {
  const {id}=useLocalSearchParams();
  const [p,setP]=useState<any>(null);const [loading,setLoading]=useState(true);
  const [sel,setSel]=useState<any>(null);const [et,setEt]=useState('WEDDING');const [date,setDate]=useState('');const [notes,setNotes]=useState('');const [booking,setBooking]=useState(false);

  useEffect(()=>{api.get(`/providers/${id}`).then(({data})=>setP(data)).catch(()=>router.back()).finally(()=>setLoading(false));},[id]);

  const book=async()=>{
    const u=await getUser();if(!u){router.push('/(auth)/login');return;}
    if(!sel){Alert.alert('','Sélectionnez un service');return;}if(!date){Alert.alert('','Entrez une date');return;}
    setBooking(true);
    try{await api.post('/bookings',{serviceId:sel.id,providerId:p.id,eventType:et,eventDate:date,notes});Alert.alert('✅','Réservation envoyée !');setSel(null);}
    catch(e:any){Alert.alert('Erreur',e.response?.data?.message||'Erreur');}finally{setBooking(false);}
  };

  if(loading)return<View style={{flex:1,justifyContent:'center',alignItems:'center'}}><ActivityIndicator size="large" color="#7C3AED"/></View>;
  if(!p)return null;

  return(<>
    <Stack.Screen options={{title:p.businessName,headerTintColor:'#7C3AED'}}/>
    <ScrollView style={s.container}>
      <View style={s.header}>
        <View style={s.avatar}><Text style={{fontSize:36}}>{CL[p.category]||'✨'}</Text></View>
        <Text style={s.name}>{p.businessName}</Text>
        <Text style={{fontSize:14,color:'#6B7280',marginTop:4}}>📍 {p.city}</Text>
        <Text style={{fontSize:14,fontWeight:'600',color:'#374151',marginTop:6}}>⭐ {p.rating>0?p.rating.toFixed(1):'Nouveau'}{p.reviewCount>0&&` (${p.reviewCount} avis)`}</Text>
        {p.description&&<Text style={{fontSize:14,color:'#6B7280',marginTop:12,textAlign:'center',lineHeight:20}}>{p.description}</Text>}
      </View>

      <View style={s.section}><Text style={s.secTitle}>Services</Text>
        {p.services?.map((sv:any)=>(
          <TouchableOpacity key={sv.id} style={[s.sCard,sel?.id===sv.id&&s.sCardSel]} onPress={()=>setSel(sel?.id===sv.id?null:sv)}>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}><Text style={{fontSize:15,fontWeight:'700',color:'#111827',flex:1}}>{sv.name}</Text><Text style={{fontSize:15,fontWeight:'800',color:'#7C3AED'}}>{sv.price?.toLocaleString()} DT</Text></View>
            <Text style={{fontSize:13,color:'#6B7280',marginTop:4}}>{sv.description}</Text>
            {sel?.id===sv.id&&<Text style={{color:'#7C3AED',fontWeight:'700',marginTop:6,fontSize:13}}>✓ Sélectionné</Text>}
          </TouchableOpacity>
        ))}
      </View>

      {sel&&<View style={s.section}><Text style={s.secTitle}>Réserver — {sel.name}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:12}}>
          {EVENTS.map(t=><TouchableOpacity key={t} style={[s.chip,et===t&&s.chipA]} onPress={()=>setEt(t)}><Text style={[s.chipT,et===t&&s.chipTA]}>{EL[t]}</Text></TouchableOpacity>)}
        </ScrollView>
        <TextInput style={s.input} placeholder="Date (YYYY-MM-DD) *" value={date} onChangeText={setDate} placeholderTextColor="#9CA3AF"/>
        <TextInput style={[s.input,{height:70}]} placeholder="Notes..." value={notes} onChangeText={setNotes} multiline placeholderTextColor="#9CA3AF"/>
        <TouchableOpacity style={[s.bookBtn,booking&&{opacity:0.6}]} onPress={book} disabled={booking}><Text style={s.bookBtnT}>{booking?'Envoi...':`Confirmer — ${sel.price?.toLocaleString()} DT`}</Text></TouchableOpacity>
      </View>}

      <View style={{height:32}}/>
    </ScrollView>
  </>);
}

const s=StyleSheet.create({
  container:{flex:1,backgroundColor:'#F9FAFB'},
  header:{alignItems:'center',backgroundColor:'#fff',padding:24},
  avatar:{width:80,height:80,borderRadius:40,backgroundColor:'#EDE9FE',justifyContent:'center',alignItems:'center',marginBottom:12},
  name:{fontSize:22,fontWeight:'800',color:'#111827'},
  section:{backgroundColor:'#fff',margin:12,borderRadius:16,padding:16},secTitle:{fontSize:18,fontWeight:'800',color:'#111827',marginBottom:12},
  sCard:{borderWidth:1.5,borderColor:'#E5E7EB',borderRadius:14,padding:14,marginBottom:10},sCardSel:{borderColor:'#7C3AED',backgroundColor:'#F5F3FF'},
  chip:{paddingHorizontal:14,paddingVertical:8,backgroundColor:'#F3F4F6',borderRadius:20,marginRight:8},chipA:{backgroundColor:'#7C3AED'},chipT:{fontSize:13,color:'#374151'},chipTA:{color:'#fff',fontWeight:'700'},
  input:{borderWidth:1,borderColor:'#E5E7EB',borderRadius:12,paddingHorizontal:14,paddingVertical:12,fontSize:14,color:'#111827',backgroundColor:'#FAFAFA',marginBottom:8},
  bookBtn:{backgroundColor:'#7C3AED',borderRadius:14,paddingVertical:16,alignItems:'center',marginTop:4},bookBtnT:{color:'#fff',fontWeight:'800',fontSize:16},
});
