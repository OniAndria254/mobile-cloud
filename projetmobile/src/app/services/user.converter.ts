import { FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from '@angular/fire/firestore';
import { User } from './users/user-service.service'; // Assurez-vous que le chemin est correct

export const userConverter: FirestoreDataConverter<User> = {
  // Fonction qui convertit un objet User en données brutes pour Firestore
  toFirestore(user: User): any {
    return {
      email: user.email,
      password: user.password
      // Vous pouvez ajouter d'autres champs ici si nécessaire
    };
  },
  // Fonction qui convertit un snapshot Firestore en objet User
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): User {
    const data = snapshot.data(options);
    return {
      email: data['email'],
      password: data['password']
      // Assurez-vous que ces champs existent dans vos documents Firestore
    };
  }
};
