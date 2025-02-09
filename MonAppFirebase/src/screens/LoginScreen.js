// screens/LoginScreen.js
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { firebase } from '../firebase';
import { SessionContext } from '../contexts/SessionContext';

export default function LoginScreen({ navigation }) {
  const { setUser } = useContext(SessionContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Recherche dans Firestore dans la collection "users"
      const querySnapshot = await firebase.firestore()
        .collection('users')
        .where('email', '==', email)
        .where('password', '==', password)
        .get();

      if (!querySnapshot.empty) {
        // On récupère le premier utilisateur trouvé
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        // Stocker l'utilisateur dans la session
        setUser({ id: userDoc.id, username: userData.username });
        // Remplacer l'écran de connexion par l'application principale
        navigation.replace('Main');
      } else {
        Alert.alert('Erreur', 'Email ou mot de passe incorrect.');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Se connecter" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    padding: 20,
  },
  title: {
    fontSize: 24, 
    textAlign: 'center', 
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});
