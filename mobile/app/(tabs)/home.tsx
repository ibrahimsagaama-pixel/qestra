import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { getUser, User } from '../../lib/auth';

const CATS = [
  {icon:'📸',label:'Photo',val:'PHOTOGRAPHER'},{icon:'🎵',label:'DJ',val:'BAND'},
  {icon:'🎨',label:'Déco',val:'DECORATOR'},{icon:'🎂',label:'Gâteaux',val:'CAKE'},
  {icon:'🏛️',label:'Salles',val:'VENUE'},{icon:'🍽️',label:'Traiteur',val:'CATERING'},
  {icon:'💐',label:'Fleurs',val:'FLORIST'},{icon:'🎤',label:'Anim.',val:'HOST'},
];

export default function HomeScreen() {
  const [user,setUser] = useState<User|null>(null);
  useEffect(()=>{getUser().then(setUser)},[]);

  return (
    <SafeAreaView style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <View><Text style={s.greeting}>Bonjour {user?.firstName} 👋</Text><Text style={s.sub}>Organisez votre événement</Text></View>
          <View style={s.avatar}><Text style={s.avatarText}>{user?.firstName?.[0]?.toUpperCase()}</Text></View>
        </View>
        <View style={s.banner}>
          <Text style={s.bannerTitle}>Trouvez le prestataire parfait</Text>
          <Text style={s.bannerSub}>Mariages · Anniversaires · Fêtes</Text>
          <TouchableOpacity style={s.bannerBtn} onPress={()=>router.push('/(tabs)/search')}><Text style={s.bannerBtnText}>Explorer</Text></TouchableOpacity>
        </View>
        <Text style={s.section}>Catégories</Text>
        <View style={s.grid}>
          {CATS.map(c=>(
            <TouchableOpacity key={c.val} style={s.catCard} onPress={()=>router.push({pathname:'/(tabs)/search',params:{category:c.val}})}>
              <Text style={{fontSize:28}}>{c.icon}</Text><Text style={s.catLabel}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:{flex:1,backgroundColor:'#F9FAFB'},
  header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:20,paddingTop:16},
  greeting:{fontSize:22,fontWeight:'800',color:'#111827'},sub:{fontSize:14,color:'#6B7280',marginTop:2},
  avatar:{width:44,height:44,borderRadius:22,backgroundColor:'#7C3AED',justifyContent:'center',alignItems:'center'},
  avatarText:{color:'#fff',fontSize:18,fontWeight:'700'},
  banner:{margin:20,backgroundColor:'#7C3AED',borderRadius:20,padding:24},
  bannerTitle:{fontSize:20,fontWeight:'800',color:'#fff',marginBottom:4},
  bannerSub:{fontSize:14,color:'#DDD6FE',marginBottom:16},
  bannerBtn:{backgroundColor:'#fff',borderRadius:12,paddingVertical:12,paddingHorizontal:20,alignSelf:'flex-start'},
  bannerBtnText:{color:'#7C3AED',fontWeight:'700',fontSize:14},
  section:{fontSize:18,fontWeight:'700',color:'#111827',paddingHorizontal:20,marginBottom:12},
  grid:{flexDirection:'row',flexWrap:'wrap',paddingHorizontal:12},
  catCard:{width:'23%',margin:'1%',backgroundColor:'#fff',borderRadius:16,padding:12,alignItems:'center',shadowColor:'#000',shadowOpacity:0.05,shadowRadius:6,elevation:2},
  catLabel:{fontSize:11,color:'#374151',textAlign:'center',fontWeight:'600',marginTop:6},
});
