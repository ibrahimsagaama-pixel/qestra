import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CLIENT' | 'PROVIDER' | 'ADMIN';
}

export const saveAuth = async (user: User, token: string) => {
  await AsyncStorage.setItem('qestra_token', token);
  await AsyncStorage.setItem('qestra_user', JSON.stringify(user));
};

export const getUser = async (): Promise<User | null> => {
  const str = await AsyncStorage.getItem('qestra_user');
  return str ? JSON.parse(str) : null;
};

export const clearAuth = async () => {
  await AsyncStorage.removeItem('qestra_token');
  await AsyncStorage.removeItem('qestra_user');
};
