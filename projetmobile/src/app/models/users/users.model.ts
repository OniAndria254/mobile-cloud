// src/app/models/user.model.ts
export class UserModel {
  constructor(
    public id_users: string,     
    public email: string,
    public username: string,
    public password: string,     // Le mot de passe hashé
    public id_tentatives: number,
    public id_role: number
  ) {}

  // Méthode statique pour créer une instance à partir d'un document Firestore
  static fromFirestore(data: any, id: string): UserModel {
    return new UserModel(
      id,
      data.email,
      data.username,
      data.password,
      data.id_tentatives,
      data.id_role
    );
  }
}
