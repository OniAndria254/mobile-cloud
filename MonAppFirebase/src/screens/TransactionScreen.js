import { Picker } from '@react-native-picker/picker';

import { Platform } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // npm install @react-native-picker/picker
import { firebase } from '../firebase'; // Assurez-vous que votre fichier firebase.js est correctement configuré
import { SessionContext } from '../contexts/SessionContext'; // Adaptez le chemin selon votre organisation

export default function TransactionScreen() {
  const { user } = useContext(SessionContext);

  // États pour la transaction
  const [transactionType, setTransactionType] = useState('buy');
  const [cryptos, setCryptos] = useState([]); // Liste des cryptomonnaies récupérées depuis Firestore
  const [selectedCryptoId, setSelectedCryptoId] = useState(null);
  const [price, setPrice] = useState(0); // Dernier prix connu pour la crypto sélectionnée
  const [quantity, setQuantity] = useState(''); // Quantité saisie par l'utilisateur (string)
  
  // Chargement de l'état de la liste
  const [loadingCryptos, setLoadingCryptos] = useState(true);
  const [loadingPrice, setLoadingPrice] = useState(false);

  // Calcul du prix total en fonction du prix courant et de la quantité saisie
  const totalPrice = price * (parseFloat(quantity) || 0);

  // 1. Récupérer la liste des cryptomonnaies depuis Firestore lors du montage du composant
  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const snapshot = await firebase.firestore().collection('cryptomonnaies').get();
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCryptos(data);
      } catch (error) {
        console.error('Erreur lors du chargement des cryptomonnaies:', error);
        Alert.alert('Erreur', "Impossible de charger la liste des cryptomonnaies.");
      } finally {
        setLoadingCryptos(false);
      }
    };

    fetchCryptos();
  }, []);

  // 2. Récupérer le dernier prix de la crypto sélectionnée depuis la collection historique_cours
  useEffect(() => {
    const fetchPrice = async () => {
      if (!selectedCryptoId) {
        setPrice(0);
        return;
      }
      setLoadingPrice(true);
      try {
        const priceSnapshot = await firebase.firestore()
          .collection('historique_cours')
          .where('Id_cryptomonnaie', '==', selectedCryptoId)
          .orderBy('date_enregistrement', 'desc')
          .limit(1)
          .get();

        if (!priceSnapshot.empty) {
          const latestPrice = priceSnapshot.docs[0].data().prix;
          setPrice(latestPrice);
        } else {
          setPrice(0);
          Alert.alert("Information", "Aucun cours trouvé pour cette cryptomonnaie.");
        }
      } catch (error) {
        console.error('Erreur lors du chargement du prix:', error);
        Alert.alert('Erreur', "Impossible de charger le prix de la cryptomonnaie.");
      } finally {
        setLoadingPrice(false);
      }
    };

    fetchPrice();
  }, [selectedCryptoId]);

  // 3. Fonction de soumission de la transaction
  const submitTransaction = async () => {
    // Vérifications de base
    if (!selectedCryptoId || !quantity) {
      Alert.alert("Erreur", "Veuillez sélectionner une cryptomonnaie et saisir une quantité.");
      return;
    }
    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert("Erreur", "Quantité invalide.");
      return;
    }
    if (!price || price <= 0) {
      Alert.alert("Erreur", "Prix non disponible pour la cryptomonnaie sélectionnée.");
      return;
    }
    
    // Calcul du montant total de la transaction
    const montantTotal = price * qty;
    
    try {
      if (transactionType === 'buy') {
        // 3.a. Traitement d'un achat

        // Récupérer le portefeuille de l'utilisateur
        const portefeuilleSnapshot = await firebase.firestore()
          .collection('portefeuilles')
          .where('id_utilisateur', '==', user.id)
          .limit(1)
          .get();

        if (portefeuilleSnapshot.empty) {
          Alert.alert("Erreur", "Portefeuille introuvable pour l'utilisateur.");
          return;
        }
        const portefeuilleDoc = portefeuilleSnapshot.docs[0];
        const portefeuilleData = portefeuilleDoc.data();

        // Vérifier le solde
        if (portefeuilleData.solde < montantTotal) {
          Alert.alert("Erreur", "Solde insuffisant pour réaliser l'achat.");
          return;
        }

        // Mettre à jour le solde du portefeuille : soustraire le montantTotal
        await firebase.firestore().collection('portefeuilles').doc(portefeuilleDoc.id)
          .update({ solde: portefeuilleData.solde - montantTotal });

        // Mettre à jour le portefeuille_crypto de l'utilisateur
        const portefeuilleCryptoSnapshot = await firebase.firestore()
          .collection('portefeuille_cryptos')
          .where('id_utilisateur', '==', user.id)
          .where('Id_cryptomonnaie', '==', selectedCryptoId)
          .limit(1)
          .get();

        if (!portefeuilleCryptoSnapshot.empty) {
          // Mise à jour du document existant
          const portefeuilleCryptoDoc = portefeuilleCryptoSnapshot.docs[0];
          const currentQuantity = parseFloat(portefeuilleCryptoDoc.data().quantite) || 0;
          await firebase.firestore().collection('portefeuille_cryptos').doc(portefeuilleCryptoDoc.id)
            .update({ quantite: currentQuantity + qty });
        } else {
          // Création d'un nouveau document
          await firebase.firestore().collection('portefeuille_cryptos')
            .add({
              id_utilisateur: user.id,
              Id_cryptomonnaie: selectedCryptoId,
              quantite: qty
            });
        }

        Alert.alert("Succès", `Achat de ${qty} unité(s) effectué pour un total de $${montantTotal.toFixed(2)}.`);
      } else {
        // 3.b. Traitement d'une vente

        // Vérifier que l'utilisateur possède suffisamment de crypto dans portefeuille_cryptos
        const portefeuilleCryptoSnapshot = await firebase.firestore()
          .collection('portefeuille_cryptos')
          .where('id_utilisateur', '==', user.id)
          .where('Id_cryptomonnaie', '==', selectedCryptoId)
          .limit(1)
          .get();

        if (portefeuilleCryptoSnapshot.empty) {
          Alert.alert("Erreur", "Vous ne possédez pas cette cryptomonnaie.");
          return;
        }
        const portefeuilleCryptoDoc = portefeuilleCryptoSnapshot.docs[0];
        const currentQuantity = parseFloat(portefeuilleCryptoDoc.data().quantite) || 0;

        if (currentQuantity < qty) {
          Alert.alert("Erreur", "Quantité insuffisante dans votre portefeuille pour vendre.");
          return;
        }

        // Mettre à jour le portefeuille_crypto : soustraire la quantité vendue
        await firebase.firestore().collection('portefeuille_cryptos').doc(portefeuilleCryptoDoc.id)
          .update({ quantite: currentQuantity - qty });

        // Mettre à jour le portefeuille (solde) en ajoutant le montantTotal
        const portefeuilleSnapshot = await firebase.firestore()
          .collection('portefeuilles')
          .where('id_utilisateur', '==', user.id)
          .limit(1)
          .get();

        if (portefeuilleSnapshot.empty) {
          Alert.alert("Erreur", "Portefeuille introuvable pour l'utilisateur.");
          return;
        }
        const portefeuilleDoc = portefeuilleSnapshot.docs[0];
        const portefeuilleData = portefeuilleDoc.data();
        await firebase.firestore().collection('portefeuilles').doc(portefeuilleDoc.id)
          .update({ solde: portefeuilleData.solde + montantTotal });

        Alert.alert("Succès", `Vente de ${qty} unité(s) effectuée pour un total de $${montantTotal.toFixed(2)}.`);
      }
    } catch (error) {
      console.error("Erreur lors de la transaction:", error);
      Alert.alert("Erreur", "Une erreur est survenue lors de la transaction.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transaction</Text>

      {/* Boutons de sélection de type de transaction */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[styles.segmentButton, transactionType === 'buy' && styles.segmentButtonActive]}
          onPress={() => setTransactionType('buy')}
        >
          <Text style={[styles.segmentText, transactionType === 'buy' && styles.segmentTextActive]}>
            Buy
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segmentButton, transactionType === 'sell' && styles.segmentButtonActive]}
          onPress={() => setTransactionType('sell')}
        >
          <Text style={[styles.segmentText, transactionType === 'sell' && styles.segmentTextActive]}>
            Sell
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sélection de la cryptomonnaie */}
      <Text style={styles.label}>Sélectionner une cryptomonnaie</Text>
      {loadingCryptos ? (
        <ActivityIndicator size="small" color="#007AFF" />
      ) : (
        <Picker
          selectedValue={selectedCryptoId}
          onValueChange={(itemValue) => setSelectedCryptoId(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="-- Sélectionner --" value={null} />
          {cryptos.map(crypto => (
            <Picker.Item
              key={crypto.id}
              label={`${crypto.nom} (${crypto.symbole})`}
              value={crypto.id}
            />
          ))}
        </Picker>
      )}

      {/* Affichage du prix courant */}
      {loadingPrice ? (
        <ActivityIndicator size="small" color="#007AFF" />
      ) : (
        <Text style={styles.label}>Prix courant: ${price.toFixed(2)}</Text>
      )}

      {/* Saisie de la quantité */}
      <Text style={styles.label}>Quantité</Text>
      <TextInput
        style={styles.input}
        placeholder="Saisir la quantité"
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />

      {/* Affichage du prix total calculé */}
      <Text style={styles.label}>
        Total: ${totalPrice.toFixed(2)}
      </Text>

      <Button
        title={transactionType === 'buy' ? 'Acheter' : 'Vendre'}
        onPress={submitTransaction}
        color={transactionType === 'buy' ? 'green' : 'red'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  segmentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  segmentButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ccc',
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 5,
  },
  segmentButtonActive: {
    backgroundColor: '#007AFF',
  },
  segmentText: {
    color: '#000',
  },
  segmentTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  label: {
    marginTop: 10,
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
});
