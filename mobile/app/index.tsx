import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { getUser } from '../lib/auth';

export default function Index() {
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    getUser().then((user) => {
      setLoggedIn(!!user);
      setReady(true);
    });
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F3FF' }}>
        <Text style={{ fontSize: 32, fontWeight: '800', color: '#7C3AED', marginBottom: 16 }}>Qestra</Text>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  if (loggedIn) return <Redirect href="/(tabs)/home" />;
  return <Redirect href="/(auth)/login" />;
}
