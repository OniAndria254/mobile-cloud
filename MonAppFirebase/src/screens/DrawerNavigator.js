// screens/DrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Importez vos écrans
import HomeScreen from './HomeScreen';
import TransactionScreen from './TransactionScreen';
import MarketScreen from './MarketScreen';
// import WalletScreen from './WalletScreen';
// import HistoriqueScreen from './HistoriqueScreen';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
      <Drawer.Screen name="Transaction" component={TransactionScreen} options={{ title: 'Transaction' }} />
      {/* <Drawer.Screen name="Market" component={MarketScreen} options={{ title: 'Market' }} /> */}
      {/* <Drawer.Screen name="Wallet" component={WalletScreen} options={{ title: 'Portefeuille' }} /> */}
      {/* <Drawer.Screen name="Historique" component={HistoriqueScreen} options={{ title: 'Historiques' }} /> */}
    </Drawer.Navigator>
  );
}
