// screens/HomeScreen.js
import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { SessionContext } from '../contexts/SessionContext';

export default function HomeScreen({ navigation }) {
  const { user } = useContext(SessionContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue, {user?.username || 'Utilisateur'} !</Text>
      <Text>ID utilisateur : {user?.id}</Text>
      <Button title="Ouvrir le menu" onPress={() => navigation.openDrawer()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     padding: 20,
  },
  title: {
     fontSize: 24,
     marginBottom: 10,
  },
});
