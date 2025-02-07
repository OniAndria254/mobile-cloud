import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query, where, CollectionReference } from '@angular/fire/firestore';
import { Observable, from, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import * as bcrypt from 'bcryptjs';

// L'interface User définie pour votre application
export interface User {
  email: string;
  password: string; // Le mot de passe hashé stocké dans Firestore
}

// Import du convertisseur depuis le fichier que vous venez de créer
import { userConverter } from '../user.converter';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: Firestore) {}

  // Méthode pour récupérer un utilisateur par email en appliquant le convertisseur
  getUserByEmail(email: string): Observable<User | null> {
    // Créez une référence à la collection "Users" avec le convertisseur
    const usersRef = collection(this.firestore, 'users').withConverter(userConverter) as CollectionReference<User>;

    // Construisez la requête pour filtrer les documents par email
    const q = query(usersRef, where('email', '==', email));

    // Utilisez collectionData pour obtenir un Observable<User[]> (avec idField si besoin)
    return collectionData(q, { idField: 'email' })
      .pipe(
        map((users: User[]) => users.length > 0 ? users[0] : null)
      );
  }

  // Méthode pour authentifier l'utilisateur en comparant le mot de passe saisi avec le hash stocké
  authenticateUser(email: string, plainPassword: string): Observable<boolean> {
    return this.getUserByEmail(email).pipe(
      switchMap(user => {
        if (!user) {
          return throwError(() => new Error("Aucun utilisateur trouvé pour cet email"));
        }
        // Enveloppez la comparaison bcrypt dans une Promise et convertissez-la en Observable
        return from(new Promise<boolean>((resolve, reject) => {
          bcrypt.compare(plainPassword, user.password, (err, isMatch) => {
            if (err) {
              reject(err);
            } else {
              resolve(isMatch);
            }
          });
        }));
      })
    );
  }
}
