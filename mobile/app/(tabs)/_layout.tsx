import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown:false, tabBarActiveTintColor:'#7C3AED', tabBarInactiveTintColor:'#9CA3AF', tabBarStyle:{backgroundColor:'#fff',borderTopColor:'#F3F4F6',height:60,paddingBottom:8}, tabBarLabelStyle:{fontSize:11,fontWeight:'600'} }}>
      <Tabs.Screen name="home" options={{title:'Accueil',tabBarIcon:({focused})=><Text style={{fontSize:20,opacity:focused?1:0.5}}>🏠</Text>}} />
      <Tabs.Screen name="search" options={{title:'Recherche',tabBarIcon:({focused})=><Text style={{fontSize:20,opacity:focused?1:0.5}}>🔍</Text>}} />
      <Tabs.Screen name="bookings" options={{title:'Réservations',tabBarIcon:({focused})=><Text style={{fontSize:20,opacity:focused?1:0.5}}>📋</Text>}} />
      <Tabs.Screen name="profile" options={{title:'Profil',tabBarIcon:({focused})=><Text style={{fontSize:20,opacity:focused?1:0.5}}>👤</Text>}} />
    </Tabs>
  );
}
