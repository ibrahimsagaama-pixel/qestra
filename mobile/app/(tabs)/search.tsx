import { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { api } from '../../lib/api';

const LABELS:Record<string,string>={BAND:'🎵 DJ',FLORIST:'💐 Fleurs',CAKE:'🎂 Gâteaux',HOST:'🎤 Anim.',DECORATOR:'🎨 Déco',PHOTOGRAPHER:'📸 Photo',VENUE:'🏛️ Salle',CATERING:'🍽️ Traiteur'};
const CATS=['','PHOTOGRAPHER','BAND','DECORATOR','CAKE','VENUE','CATERING','FLORIST','HOST'];

export default function SearchScreen() {
  const params=useLocalSearchParams();
  const [city,setCity]=useState('');
  const [cat,setCat]=useState((params.category as string)||'');
  const [list,setList]=useState<any[]>([]);
  const [loading,setLoading]=useState(false);

  const search=async()=>{setLoading(true);try{const q=new URLSearchParams();if(cat)q.append('category',cat);if(city)q.append('city',city);const{data}=await api.get(`/providers?${q}`);setList(data);}catch{setList([]);}finally{setLoading(false);}};
  useEffect(()=>{search();},[cat]);

  return (
    <SafeAreaView style={s.container}>
      <View style={{padding:16,paddingBottom:8}}><Text style={s.title}>Rechercher</Text>
        <TextInput style={s.input} placeholder="🏙️ Filtrer par ville..." value={city} onChangeText={setCity} onSubmitEditing={search} returnKeyType="search" placeholderTextColor="#9CA3AF"/>
      </View>
      <FlatList horizontal data={CATS} keyExtractor={i=>i} showsHorizontalScrollIndicator={false} style={{maxHeight:46,marginBottom:4}} contentContainerStyle={{paddingHorizontal:16}}
        renderItem={({item})=>(<TouchableOpacity style={[s.chip,cat===item&&s.chipA]} onPress={()=>setCat(item)}><Text style={[s.chipT,cat===item&&s.chipTA]}>{item===''?'Tous':(LABELS[item]||item)}</Text></TouchableOpacity>)}/>
      {loading?<View style={s.center}><ActivityIndicator size="large" color="#7C3AED"/></View>:
      <FlatList data={list} keyExtractor={i=>i.id} contentContainerStyle={{padding:16}}
        ListEmptyComponent={<View style={s.center}><Text style={{fontSize:48}}>🔍</Text><Text style={{color:'#9CA3AF',marginTop:10}}>Aucun prestataire</Text></View>}
        renderItem={({item})=>(
          <TouchableOpacity style={s.card} onPress={()=>router.push(`/providers/${item.id}`)}>
            <View style={s.cardImg}><Text style={{fontSize:32}}>{LABELS[item.category]?.split(' ')[0]||'✨'}</Text></View>
            <View style={{flex:1,padding:12}}>
              <Text style={s.cardName}>{item.businessName}</Text>
              <Text style={{fontSize:12,color:'#7C3AED',marginTop:2}}>{LABELS[item.category]}</Text>
              <Text style={{fontSize:12,color:'#9CA3AF',marginTop:4}}>📍 {item.city}</Text>
              <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:8}}>
                <Text style={{fontSize:13,color:'#374151',fontWeight:'600'}}>⭐ {item.rating>0?item.rating.toFixed(1):'Nouveau'}</Text>
                {item.services?.[0]&&<Text style={{fontSize:12,color:'#7C3AED',fontWeight:'600'}}>{item.services[0].price.toLocaleString()} DT</Text>}
              </View>
            </View>
          </TouchableOpacity>
        )}/>}
    </SafeAreaView>
  );
}

const s=StyleSheet.create({
  container:{flex:1,backgroundColor:'#F9FAFB'},title:{fontSize:24,fontWeight:'800',color:'#111827',marginBottom:12},
  input:{borderWidth:1,borderColor:'#E5E7EB',borderRadius:14,paddingHorizontal:16,paddingVertical:12,fontSize:15,backgroundColor:'#fff',color:'#111827'},
  chip:{paddingHorizontal:14,paddingVertical:8,backgroundColor:'#fff',borderRadius:20,marginRight:8,borderWidth:1,borderColor:'#E5E7EB'},
  chipA:{backgroundColor:'#7C3AED',borderColor:'#7C3AED'},chipT:{fontSize:13,color:'#374151',fontWeight:'500'},chipTA:{color:'#fff',fontWeight:'700'},
  center:{flex:1,alignItems:'center',justifyContent:'center',paddingTop:60},
  card:{backgroundColor:'#fff',borderRadius:16,marginBottom:12,flexDirection:'row',shadowColor:'#000',shadowOpacity:0.06,shadowRadius:8,elevation:3,overflow:'hidden'},
  cardImg:{width:80,backgroundColor:'#EDE9FE',justifyContent:'center',alignItems:'center'},cardName:{fontSize:16,fontWeight:'700',color:'#111827'},
});
