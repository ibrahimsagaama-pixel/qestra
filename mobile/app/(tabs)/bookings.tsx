import { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { api } from '../../lib/api';
import { getUser } from '../../lib/auth';

const ST:Record<string,{l:string;c:string;bg:string}>={PENDING:{l:'En attente',c:'#92400E',bg:'#FEF3C7'},CONFIRMED:{l:'Confirmée',c:'#065F46',bg:'#D1FAE5'},CANCELLED:{l:'Annulée',c:'#991B1B',bg:'#FEE2E2'},COMPLETED:{l:'Terminée',c:'#374151',bg:'#F3F4F6'}};

export default function BookingsScreen() {
  const [list,setList]=useState<any[]>([]);const [loading,setLoading]=useState(true);const [ref,setRef]=useState(false);
  const load=async()=>{try{const u=await getUser();const{data}=await api.get(u?.role==='PROVIDER'?'/bookings/provider':'/bookings/client');setList(data);}catch{setList([]);}finally{setLoading(false);setRef(false);}};
  useFocusEffect(useCallback(()=>{load();},[]))
  if(loading)return<View style={s.center}><ActivityIndicator size="large" color="#7C3AED"/></View>;
  return(
    <SafeAreaView style={s.container}><Text style={s.title}>Mes réservations</Text>
      <FlatList data={list} keyExtractor={i=>i.id} contentContainerStyle={{padding:16}} refreshControl={<RefreshControl refreshing={ref} onRefresh={()=>{setRef(true);load();}} tintColor="#7C3AED"/>}
        ListEmptyComponent={<View style={s.center}><Text style={{fontSize:48}}>📋</Text><Text style={{color:'#9CA3AF',marginTop:12}}>Aucune réservation</Text></View>}
        renderItem={({item})=>{const st=ST[item.status]||ST.PENDING;return(
          <View style={s.card}><View style={{flexDirection:'row',alignItems:'flex-start',marginBottom:10}}>
            <View style={{flex:1}}><Text style={s.cardTitle}>{item.service?.name}</Text><Text style={{fontSize:13,color:'#6B7280',marginTop:2}}>{item.provider?.businessName||`${item.client?.firstName} ${item.client?.lastName}`}</Text></View>
            <View style={[s.badge,{backgroundColor:st.bg}]}><Text style={[s.badgeT,{color:st.c}]}>{st.l}</Text></View>
          </View><View style={{flexDirection:'row',justifyContent:'space-between'}}><Text style={{fontSize:13,color:'#6B7280'}}>📅 {new Date(item.eventDate).toLocaleDateString('fr-FR')}</Text><Text style={{fontSize:15,fontWeight:'700',color:'#7C3AED'}}>{item.totalPrice?.toLocaleString()} DT</Text></View></View>
        );}}/>
    </SafeAreaView>);
}

const s=StyleSheet.create({container:{flex:1,backgroundColor:'#F9FAFB'},center:{flex:1,justifyContent:'center',alignItems:'center'},title:{fontSize:24,fontWeight:'800',color:'#111827',padding:16,paddingBottom:4},card:{backgroundColor:'#fff',borderRadius:16,padding:16,marginBottom:12,shadowColor:'#000',shadowOpacity:0.05,shadowRadius:8,elevation:2},cardTitle:{fontSize:16,fontWeight:'700',color:'#111827'},badge:{paddingHorizontal:10,paddingVertical:4,borderRadius:20},badgeT:{fontSize:12,fontWeight:'600'}});
