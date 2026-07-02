import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { getUser, clearAuth, User } from '../../lib/auth';

export default function ProfileScreen() {
  const [user,setUser]=useState<User|null>(null);
  useEffect(()=>{getUser().then(setUser);},[]);
  const logout=()=>Alert.alert('Déconnexion','Voulez-vous vous déconnecter ?',[{text:'Annuler',style:'cancel'},{text:'Oui',style:'destructive',onPress:async()=>{await clearAuth();router.replace('/(auth)/login');}}]);

  return(
    <SafeAreaView style={s.container}><ScrollView>
      <Text style={s.title}>Mon profil</Text>
      <View style={s.avatarBox}>
        <View style={s.avatar}><Text style={s.avatarText}>{user?.firstName?.[0]?.toUpperCase()}</Text></View>
        <Text style={s.name}>{user?.firstName} {user?.lastName}</Text>
        <Text style={s.email}>{user?.email}</Text>
        <View style={s.roleBadge}><Text style={s.roleText}>{user?.role==='PROVIDER'?'🏢 Prestataire':'👤 Client'}</Text></View>
      </View>
      <View style={s.menu}>
        <TouchableOpacity style={s.menuItem} onPress={()=>router.push('/(tabs)/bookings')}><Text style={{fontSize:22,marginRight:14}}>📋</Text><Text style={s.menuLabel}>Mes réservations</Text><Text style={{fontSize:22,color:'#9CA3AF'}}>›</Text></TouchableOpacity>
        <TouchableOpacity style={[s.menuItem,{borderBottomWidth:0}]} onPress={logout}><Text style={{fontSize:22,marginRight:14}}>🚪</Text><Text style={[s.menuLabel,{color:'#EF4444'}]}>Déconnexion</Text><Text style={{fontSize:22,color:'#9CA3AF'}}>›</Text></TouchableOpacity>
      </View>
      <Text style={{textAlign:'center',color:'#D1D5DB',fontSize:12,marginTop:32}}>Qestra v1.0.0</Text>
    </ScrollView></SafeAreaView>);
}

const s=StyleSheet.create({
  container:{flex:1,backgroundColor:'#F9FAFB'},title:{fontSize:24,fontWeight:'800',color:'#111827',padding:20,paddingBottom:8},
  avatarBox:{alignItems:'center',paddingVertical:24,backgroundColor:'#fff',marginHorizontal:16,borderRadius:20,marginBottom:16,shadowColor:'#000',shadowOpacity:0.05,shadowRadius:8,elevation:2},
  avatar:{width:80,height:80,borderRadius:40,backgroundColor:'#7C3AED',justifyContent:'center',alignItems:'center',marginBottom:12},
  avatarText:{fontSize:32,fontWeight:'800',color:'#fff'},name:{fontSize:20,fontWeight:'700',color:'#111827'},email:{fontSize:14,color:'#6B7280',marginTop:4},
  roleBadge:{marginTop:10,backgroundColor:'#EDE9FE',paddingHorizontal:14,paddingVertical:6,borderRadius:20},roleText:{color:'#7C3AED',fontWeight:'600',fontSize:13},
  menu:{marginHorizontal:16,backgroundColor:'#fff',borderRadius:20,overflow:'hidden',shadowColor:'#000',shadowOpacity:0.05,shadowRadius:8,elevation:2},
  menuItem:{flexDirection:'row',alignItems:'center',padding:16,borderBottomWidth:1,borderBottomColor:'#F3F4F6'},menuLabel:{flex:1,fontSize:15,fontWeight:'600',color:'#374151'},
});
