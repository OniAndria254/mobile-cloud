// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// Importez le SessionProvider depuis le dossier où vous l'avez placé
// Si vous avez choisi de le mettre dans src/contexts, utilisez ce chemin :
import { SessionProvider } from './src/contexts/SessionContext';
// Sinon, si vous l'avez mis directement dans src, utilisez :
// import { SessionProvider } from './src/SessionContext';

import LoginScreen from './src/screens/LoginScreen';
import DrawerNavigator from './src/screens/DrawerNavigator';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SessionProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Main" component={DrawerNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </SessionProvider>
  );
}
